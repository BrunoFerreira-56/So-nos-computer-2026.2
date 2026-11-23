/** PUT/DELETE /api/me/favorites/:listingId — favoritar e desfavoritar (US04 · RF04). */
import { getDb } from "@/mocks/db";
import { fail, withUser } from "@/mocks/http";

type Ctx = { params: Promise<{ listingId: string }> };

export const PUT = withUser(async (user, _request: Request, { params }: Ctx) => {
  const { listingId } = await params;
  const db = getDb();
  if (!db.listings.some((l) => l.id === listingId)) return fail(404, "Anúncio não encontrado.");
  const current = db.favorites[user.id] ?? [];
  if (!current.includes(listingId)) db.favorites[user.id] = [listingId, ...current];
  return new Response(null, { status: 204 });
});

export const DELETE = withUser(async (user, _request: Request, { params }: Ctx) => {
  const { listingId } = await params;
  const db = getDb();
  db.favorites[user.id] = (db.favorites[user.id] ?? []).filter((id) => id !== listingId);
  return new Response(null, { status: 204 });
});
