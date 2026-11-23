/**
 * Tela:   Conversa · Conversa sem conexão
 * Figma:  D07 (83:4783) · D07b (83:4823) · M05 (83:5436)
 * US:     US11, US14 (avaliar a partir do chat)
 * RF/RNF: RF11, RF14, RNF03, RNF04, RNF07
 */
import { Suspense } from "react";
import { ConversationThread, ThreadSkeleton } from "@/features/chat/components/conversation-thread";

export default function ConversationPage() {
  return (
    <Suspense fallback={<ThreadSkeleton />}>
      <ConversationThread />
    </Suspense>
  );
}
