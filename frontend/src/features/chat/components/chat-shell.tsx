"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import type { ReactNode } from "react";
import { preload } from "react-dom";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";
import { cn } from "@/lib/format";
import { useChatOutbox } from "../hooks";
import { ConversationList } from "./conversation-list";

/**
 * Estrutura do chat (D07): lista à esquerda + conversa à direita no desktop.
 * No celular (M04/M05) mostra uma coisa por vez: a lista em /conversas e a conversa em /conversas/:id.
 */
export function ChatShell({ children }: { children: ReactNode }) {
  const threadOpen = useSelectedLayoutSegment() !== null;
  // Envia mensagens escritas offline assim que a conexão voltar (RNF07).
  useChatOutbox();
  // O ícone do alerta "Sem conexão" só aparece offline, quando já não daria para baixá-lo.
  // `mask-image` busca em modo CORS, por isso o crossOrigin.
  preload("/icons/wifi-off.svg", { as: "image", crossOrigin: "anonymous" });

  return (
    // Altura fixa para a lista e as mensagens rolarem por dentro. No celular, a barra inferior
    // (72 px) só aparece na lista; no desktop, desconta o header (71 px).
    <div className={cn("flex min-h-0 md:h-[calc(100dvh-71px)]", threadOpen ? "h-dvh" : "h-[calc(100dvh-72px)]")}>
      <aside
        className={cn(
          "w-full shrink-0 overflow-y-auto border-ut-border md:block md:w-[376px] md:border-r",
          threadOpen && "hidden",
        )}
      >
        <MobileTopBar title="Conversas" variant="inicio" />
        <ConversationList />
      </aside>
      <section className={cn("min-w-0 flex-1 flex-col", threadOpen ? "flex" : "hidden md:flex")}>{children}</section>
    </div>
  );
}
