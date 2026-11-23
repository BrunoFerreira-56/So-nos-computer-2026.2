/**
 * Tela:   Chat interno (lista + conversa)
 * Figma:  D07 (83:4783) · D07b (83:4823) · M04 (83:5428) · M05 (83:5436)
 * US:     US05, US11, US15
 * RF/RNF: RF05, RF11, RNF03, RNF04, RNF05, RNF07
 */
import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { ChatShell } from "@/features/chat/components/chat-shell";

export const metadata: Metadata = { title: "Conversas" };

export default function ConversationsLayout({ children }: { children: ReactNode }) {
  // Suspense: o shell lê o segmento da URL para decidir o que mostrar no celular.
  return (
    <Suspense>
      <ChatShell>{children}</ChatShell>
    </Suspense>
  );
}
