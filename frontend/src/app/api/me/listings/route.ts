/** GET /api/me/listings — anúncios do usuário logado com contadores (D09 · US07, US10). */
import { getDb } from "@/mocks/db";
import { ok, withUser } from "@/mocks/http";
import type { MyListingsSummary } from "@/types/domain";

export const GET = withUser(async (user) => {
  const db = getDb();
  const listings = db.listings
    .filter((l) => l.sellerId === user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const body: MyListingsSummary = {
    listings,
    counts: {
      disponivel: listings.filter((l) => l.status === "disponivel").length,
      vendido: listings.filter((l) => l.status === "vendido").length,
      inativo: listings.filter((l) => l.status === "inativo").length,
      conversasAbertas: db.conversations.filter((c) => c.sellerId === user.id || c.buyerId === user.id).length,
    },
  };
  return ok(body);
});
