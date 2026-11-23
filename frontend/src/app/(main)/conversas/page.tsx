/**
 * Tela:   Conversas — nenhuma conversa selecionada (painel direito no desktop)
 * Figma:  D07 (83:4783) · M04 (83:5428)
 * US:     US11
 * RF/RNF: RF11
 */
import { EmptyState } from "@/components/ui/empty-state";

export default function ConversationsIndexPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <EmptyState
        icon="chat"
        title="Selecione uma conversa"
        description="Escolha uma conversa na lista ao lado para ver as mensagens e negociar."
      />
    </div>
  );
}
