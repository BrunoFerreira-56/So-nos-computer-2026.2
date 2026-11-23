/**
 * GET /api/conversations/:id — mensagens da conversa (D07 · US11 · RF11, RNF07).
 * Abrir a conversa marca como lidas as mensagens recebidas.
 */
import { getDb } from "@/mocks/db";
import { fail, ok, withUser } from "@/mocks/http";
import { toConversationDetail } from "@/mocks/serializers";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withUser(async (user, _request: Request, { params }: Ctx) => {
  const { id } = await params;
  const db = getDb();
  const conversation = db.conversations.find((c) => c.id === id);
  if (!conversation) return fail(404, "Conversa não encontrada.");
  if (conversation.buyerId !== user.id && conversation.sellerId !== user.id) {
    return fail(403, "Você não participa desta conversa.");
  }

  const now = new Date().toISOString();
  for (const message of db.messages) {
    if (message.conversationId === id && message.authorId !== user.id && !message.readAt) {
      message.readAt = now;
    }
  }
  return ok(toConversationDetail(id, user.id));
});
