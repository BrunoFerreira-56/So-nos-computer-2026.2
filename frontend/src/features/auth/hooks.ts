"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { authApi } from "./api";

/** Usuário logado. A rota já é protegida pelo `proxy.ts`, então aqui ele normalmente existe. */
export function useSession() {
  return useQuery({ queryKey: queryKeys.session, queryFn: authApi.me, staleTime: 5 * 60_000 });
}

/** Aceita só caminhos internos, para o parâmetro `voltar` não virar um redirecionamento aberto. */
export function safeRedirect(target: string | null | undefined): string {
  return target && target.startsWith("/") && !target.startsWith("//") ? target : "/";
}

/**
 * Entrar/sair faz uma navegação completa (não client-side): nenhum dado em cache nem tela
 * preservada pelo <Activity> do Next (cacheComponents) da sessão anterior sobrevive.
 */
function hardNavigate(target: string) {
  window.location.replace(target);
}

function useStartSession(redirectTo = "/") {
  const queryClient = useQueryClient();
  return () => {
    queryClient.clear();
    hardNavigate(safeRedirect(redirectTo));
  };
}

/** Login (US01). `redirectTo` vem do `?voltar=` que o proxy adiciona. */
export function useLogin(redirectTo?: string) {
  const startSession = useStartSession(redirectTo);
  return useMutation({ mutationFn: authApi.login, onSuccess: startSession });
}

export function useRegister() {
  const startSession = useStartSession();
  return useMutation({ mutationFn: authApi.register, onSuccess: startSession });
}

export function useResetPassword() {
  const startSession = useStartSession();
  return useMutation({ mutationFn: authApi.resetPassword, onSuccess: startSession });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: authApi.forgotPassword });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
      hardNavigate("/login");
    },
  });
}

export function useUpdateCampus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.updateCampus,
    onSuccess: (user) => queryClient.setQueryData(queryKeys.session, user),
  });
}
