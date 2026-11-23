/**
 * GET    /api/listings/:id — detalhes (US03 · RF03).
 * PATCH  /api/listings/:id — editar, só o dono (US07 · RF07).
 * DELETE /api/listings/:id — excluir, só o dono (US07 · RF07).
 */
import { listingSchema } from "@/features/listings/schemas";
import { getDb } from "@/mocks/db";
import { fail, ok, parseBody, withUser } from "@/mocks/http";
import { toListingWithSeller } from "@/mocks/serializers";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withUser(async (user, _request: Request, { params }: Ctx) => {
  const { id } = await params;
  const listing = getDb().listings.find((l) => l.id === id);
  if (!listing) return fail(404, "Anúncio não encontrado.");
  return ok(toListingWithSeller(listing, user.id));
});

export const PATCH = withUser(async (user, request: Request, { params }: Ctx) => {
  const { id } = await params;
  const listing = getDb().listings.find((l) => l.id === id);
  if (!listing) return fail(404, "Anúncio não encontrado.");
  if (listing.sellerId !== user.id) return fail(403, "Só quem criou o anúncio pode editá-lo.");

  const { data, error } = await parseBody(request, listingSchema);
  if (error) return error;
  Object.assign(listing, data);
  return ok(toListingWithSeller(listing, user.id));
});

export const DELETE = withUser(async (user, _request: Request, { params }: Ctx) => {
  const { id } = await params;
  const db = getDb();
  const listing = db.listings.find((l) => l.id === id);
  if (!listing) return fail(404, "Anúncio não encontrado.");
  if (listing.sellerId !== user.id) return fail(403, "Só quem criou o anúncio pode excluí-lo.");

  db.listings = db.listings.filter((l) => l.id !== id);
  for (const userId of Object.keys(db.favorites)) {
    db.favorites[userId] = (db.favorites[userId] ?? []).filter((favId) => favId !== id);
  }
  return new Response(null, { status: 204 });
});
