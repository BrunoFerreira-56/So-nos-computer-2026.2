/**
 * Converte registros do banco mock nos formatos públicos da API (tipos em `@/types/domain`).
 */
import type {
  ConversationDetail,
  ConversationSummary,
  Listing,
  ListingWithSeller,
  Message,
  Review,
  User,
  UserProfile,
} from "@/types/domain";
import { getDb, type DbUser } from "./db";

/** Tempo até o "outro lado" ler uma mensagem enviada (simula o "Lida ✓✓" do Figma D07). */
const SIMULATED_READ_DELAY_MS = 2_000;

export function toUser(user: DbUser): User {
  const { password: _password, ratingSeed: _ratingSeed, ...rest } = user;
  return rest;
}

export function toProfile(user: DbUser): UserProfile {
  const db = getDb();
  const reviews = db.reviews.filter((r) => r.targetUserId === user.id);
  const sum = user.ratingSeed.sum + reviews.reduce((acc, r) => acc + r.rating, 0);
  const count = user.ratingSeed.count + reviews.length;
  const { email: _email, ...publicUser } = toUser(user);
  return {
    ...publicUser,
    rating: count ? sum / count : 0,
    ratingCount: count,
    activeListings: db.listings.filter((l) => l.sellerId === user.id && l.status === "disponivel").length,
  };
}

export function findUser(id: string): DbUser | undefined {
  return getDb().users.find((u) => u.id === id);
}

export function toListingWithSeller(listing: Listing, viewerId: string): ListingWithSeller {
  const db = getDb();
  const seller = findUser(listing.sellerId);
  if (!seller) throw new Error(`Vendedor ${listing.sellerId} não encontrado`);
  return {
    ...listing,
    seller: toProfile(seller),
    isFavorite: (db.favorites[viewerId] ?? []).includes(listing.id),
  };
}

export function toReview(review: ReturnType<typeof getDb>["reviews"][number]): Review {
  const author = findUser(review.authorId);
  const { authorId: _authorId, ...rest } = review;
  return { ...rest, author: { id: review.authorId, name: author?.name ?? "Usuário" } };
}

/** Marca como lidas as mensagens do próprio usuário que o outro lado "já viu". */
function simulateCounterpartReads(messages: Message[], viewerId: string) {
  const now = Date.now();
  for (const message of messages) {
    if (
      message.authorId === viewerId &&
      !message.readAt &&
      now - new Date(message.createdAt).getTime() > SIMULATED_READ_DELAY_MS
    ) {
      message.readAt = new Date().toISOString();
    }
  }
}

export function toConversationSummary(conversationId: string, viewerId: string): ConversationSummary {
  const db = getDb();
  const conversation = db.conversations.find((c) => c.id === conversationId);
  if (!conversation) throw new Error(`Conversa ${conversationId} não encontrada`);
  const listing = db.listings.find((l) => l.id === conversation.listingId);
  const counterpartId = conversation.buyerId === viewerId ? conversation.sellerId : conversation.buyerId;
  const counterpart = findUser(counterpartId);
  if (!listing || !counterpart) throw new Error("Conversa com dados inconsistentes");

  const messages = db.messages
    .filter((m) => m.conversationId === conversation.id)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  simulateCounterpartReads(messages, viewerId);

  return {
    ...conversation,
    listing: {
      id: listing.id,
      title: listing.title,
      priceCents: listing.priceCents,
      status: listing.status,
      images: listing.images.slice(0, 1),
    },
    counterpart: toProfile(counterpart),
    lastMessage: messages.at(-1) ?? null,
    unread: messages.some((m) => m.authorId !== viewerId && !m.readAt),
    role: conversation.buyerId === viewerId ? "comprando" : "vendendo",
  };
}

export function toConversationDetail(conversationId: string, viewerId: string): ConversationDetail {
  const summary = toConversationSummary(conversationId, viewerId);
  const messages = getDb()
    .messages.filter((m) => m.conversationId === conversationId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return { ...summary, messages };
}
