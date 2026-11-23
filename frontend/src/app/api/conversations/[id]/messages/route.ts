/** POST /api/conversations/:id/messages — envia mensagem (US11 · RF11, RNF03). */
import { messageSchema } from "@/features/chat/schemas";
import { getDb, newId } from "@/mocks/db";
import { delay, fail, getSessionUser, ok, parseBody } from "@/mocks/http";
import type { Message } from "@/types/domain";

type Ctx = { params: Promise<{ id: string }> };

/** Sem o atraso padrão dos outros endpoints: o RNF03 pede entrega em até 500 ms. */
export async function POST(request: Request, { params }: Ctx) {
  await delay(120);
  const user = await getSessionUser();
  if (!user) return fail(401, "Sua sessão expirou. Entre novamente.", { code: "unauthenticated" });

  const { id } = await params;
  const db = getDb();
  const conversation = db.conversations.find((c) => c.id === id);
  if (!conversation) return fail(404, "Conversa não encontrada.");
  if (conversation.buyerId !== user.id && conversation.sellerId !== user.id) {
    return fail(403, "Você não participa desta conversa.");
  }

  const { data, error } = await parseBody(request, messageSchema);
  if (error) return error;

  const message: Message = {
    id: newId("m"),
    conversationId: id,
    authorId: user.id,
    text: data.text,
    createdAt: new Date().toISOString(),
    readAt: null,
  };
  db.messages.push(message);
  conversation.updatedAt = message.createdAt;
  return ok(message, { status: 201 });
}
