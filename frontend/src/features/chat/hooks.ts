"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { isApiError } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import { useOnlineStatus } from "@/hooks/use-online-status";
import type { ConversationDetail, Message } from "@/types/domain";
import { chatApi } from "./api";
import { pendingStore } from "./pending-store";

/** Intervalo de atualização enquanto a conversa está aberta (simula o tempo real do RNF03). */
const LIVE_REFETCH_MS = 2_000;

export function useConversations() {
  const online = useOnlineStatus();
  return useQuery({
    queryKey: queryKeys.conversations.all,
    queryFn: chatApi.list,
    refetchInterval: online ? LIVE_REFETCH_MS * 3 : false,
  });
}

export function useConversation(id: string) {
  const online = useOnlineStatus();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: queryKeys.conversations.detail(id),
    queryFn: () => chatApi.get(id),
    refetchInterval: online ? LIVE_REFETCH_MS : false,
  });
  // Abrir a conversa marca mensagens como lidas: atualiza o ponto de "não lida" na lista.
  const loaded = query.isSuccess;
  useEffect(() => {
    if (loaded) void queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all, exact: true });
  }, [id, loaded, queryClient]);
  return query;
}

/** Abre a conversa com o anunciante e navega até ela (US05: contato pelo chat interno). */
export function useStartConversation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: chatApi.start,
    onSuccess: async ({ id }) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all });
      router.push(`/conversas/${id}`);
    },
  });
}

/** Mensagens pendentes (sem conexão) de uma conversa. */
export function usePendingMessages(conversationId: string) {
  const all = useSyncExternalStore(pendingStore.subscribe, pendingStore.getSnapshot, pendingStore.getServerSnapshot);
  return all.filter((m) => m.conversationId === conversationId);
}

/**
 * Envia mensagem com atualização otimista. Se a rede cair no meio do envio,
 * a mensagem vai para a fila local em vez de se perder (RNF07).
 */
export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  const online = useOnlineStatus();
  const key = queryKeys.conversations.detail(conversationId);

  const mutation = useMutation({
    mutationFn: (text: string) => chatApi.send(conversationId, text),
    networkMode: "always",
    onMutate: async (text) => {
      await queryClient.cancelQueries({ queryKey: key });
      const optimistic: Message = {
        id: `temp-${crypto.randomUUID()}`,
        conversationId,
        authorId: queryClient.getQueryData<{ id: string }>(queryKeys.session)?.id ?? "",
        text,
        createdAt: new Date().toISOString(),
        readAt: null,
      };
      queryClient.setQueryData<ConversationDetail>(key, (c) =>
        c ? { ...c, messages: [...c.messages, optimistic] } : c,
      );
      return { optimisticId: optimistic.id };
    },
    onError: (error, text, context) => {
      queryClient.setQueryData<ConversationDetail>(key, (c) =>
        c ? { ...c, messages: c.messages.filter((m) => m.id !== context?.optimisticId) } : c,
      );
      if (isApiError(error) && error.code === "network") {
        pendingStore.add({ conversationId, text });
      }
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: key }),
        queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all, exact: true }),
      ]),
  });

  return {
    ...mutation,
    send(text: string) {
      if (!online) {
        pendingStore.add({ conversationId, text });
        return;
      }
      mutation.mutate(text);
    },
  };
}

/**
 * Esvazia a fila de mensagens pendentes quando a conexão volta.
 * Fica montado no layout do chat para funcionar em qualquer conversa.
 */
export function useChatOutbox() {
  const online = useOnlineStatus();
  const queryClient = useQueryClient();
  const flushing = useRef(false);
  const pending = useSyncExternalStore(
    pendingStore.subscribe,
    pendingStore.getSnapshot,
    pendingStore.getServerSnapshot,
  );

  // Incrementado para tentar de novo quando o envio falha logo após o evento "online"
  // (a rede pode demorar alguns instantes para voltar de fato).
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!online || flushing.current || pending.length === 0) return;
    flushing.current = true;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    void (async () => {
      for (const message of pending) {
        try {
          await chatApi.send(message.conversationId, message.text);
          pendingStore.remove(message.clientId);
        } catch (error) {
          // Erro definitivo (ex.: conversa removida): descarta. Erro de rede: tenta de novo em instantes.
          if (isApiError(error) && error.code !== "network") {
            pendingStore.remove(message.clientId);
          } else {
            retryTimer = setTimeout(() => setAttempt((n) => n + 1), OUTBOX_RETRY_MS);
            break;
          }
        }
      }
      flushing.current = false;
      await queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all });
    })();
    return () => clearTimeout(retryTimer);
  }, [online, pending, queryClient, attempt]);
}

const OUTBOX_RETRY_MS = 2_000;
