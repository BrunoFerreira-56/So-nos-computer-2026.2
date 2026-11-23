/** GET /api/users/:id — perfil público com anúncios e avaliações (D10). Aceita "me". */
import { getDb } from "@/mocks/db";
import { fail, ok, withUser } from "@/mocks/http";
import { findUser, toListingWithSeller, toProfile, toReview } from "@/mocks/serializers";
import type { PublicProfile } from "@/types/domain";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withUser(async (viewer, _request: Request, { params }: Ctx) => {
  const { id } = await params;
  const target = id === "me" ? viewer : findUser(id);
  if (!target) return fail(404, "Usuário não encontrado.");

  const db = getDb();
  const body: PublicProfile = {
    user: toProfile(target),
    listings: db.listings
      .filter((l) => l.sellerId === target.id && l.status === "disponivel")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((l) => toListingWithSeller(l, viewer.id)),
    reviews: db.reviews
      .filter((r) => r.targetUserId === target.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(toReview),
  };
  return ok(body);
});
