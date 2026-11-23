/**
 * GET  /api/conversations — lista de conversas do usuário (D07 · US11 · RF11).
 * POST /api/conversations — abre (ou reaproveita) a conversa sobre um anúncio (US05 · RF05).
 */
import { startConversationSchema } from "@/features/chat/schemas";
import { getDb, newId } from "@/mocks/db";
import { fail, ok, parseBody, withUser } from "@/mocks/http";
import { toConversationSummary } from "@/mocks/serializers";

export const GET = withUser(async (user) => {
  const items = getDb()
    .conversations.filter((c) => c.buyerId === user.id || c.sellerId === user.id)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((c) => toConversationSummary(c.id, user.id));
  return ok(items);
});

export const POST = withUser(async (user, request: Request) => {
  const { data, error } = await parseBody(request, startConversationSchema);
  if (error) return error;

  const db = getDb();
  const listing = db.listings.find((l) => l.id === data.listingId);
  if (!listing) return fail(404, "Anúncio não encontrado.");
  if (listing.sellerId === user.id) return fail(400, "Você não pode iniciar uma conversa com você mesmo.");

  let conversation = db.conversations.find((c) => c.listingId === listing.id && c.buyerId === user.id);
  const now = new Date().toISOString();
  if (!conversation) {
    conversation = {
      id: newId("c"),
      listingId: listing.id,
      buyerId: user.id,
      sellerId: listing.sellerId,
      updatedAt: now,
    };
    db.conversations.unshift(conversation);
    listing.conversationsCount += 1;
  }
  if (data.message) {
    db.messages.push({
      id: newId("m"),
      conversationId: conversation.id,
      authorId: user.id,
      text: data.message,
      createdAt: now,
      readAt: null,
    });
    conversation.updatedAt = now;
  }
  return ok({ id: conversation.id }, { status: 201 });
});
