/** GET /api/me/favorites — anúncios favoritados (D05 · US04 · RF04). */
import { getDb } from "@/mocks/db";
import { ok, withUser } from "@/mocks/http";
import { toListingWithSeller } from "@/mocks/serializers";

export const GET = withUser(async (user) => {
  const db = getDb();
  const ids = db.favorites[user.id] ?? [];
  const items = ids
    .map((id) => db.listings.find((l) => l.id === id))
    .filter((l) => l !== undefined)
    .map((l) => toListingWithSeller(l, user.id));
  return ok(items);
});
