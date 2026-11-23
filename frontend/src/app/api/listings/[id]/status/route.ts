/** PATCH /api/listings/:id/status — Disponível / Vendido / Inativo, só o dono (US10 · RF10). */
import { statusSchema } from "@/features/listings/schemas";
import { getDb } from "@/mocks/db";
import { fail, ok, parseBody, withUser } from "@/mocks/http";
import { toListingWithSeller } from "@/mocks/serializers";

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = withUser(async (user, request: Request, { params }: Ctx) => {
  const { id } = await params;
  const listing = getDb().listings.find((l) => l.id === id);
  if (!listing) return fail(404, "Anúncio não encontrado.");
  if (listing.sellerId !== user.id) return fail(403, "Só quem criou o anúncio pode alterar o status.");

  const { data, error } = await parseBody(request, statusSchema);
  if (error) return error;
  listing.status = data.status;
  return ok(toListingWithSeller(listing, user.id));
});
