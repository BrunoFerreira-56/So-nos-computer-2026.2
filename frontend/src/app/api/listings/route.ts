/**
 * GET  /api/listings?q=&campus= — hub, busca e filtro por campus (US02, US08, US09 · RF02, RF08, RF09).
 * POST /api/listings            — criar anúncio (US06 · RF06).
 * Apenas anúncios "disponivel" aparecem na listagem (US10).
 */
import { categoryName, campusName } from "@/lib/constants";
import { listingSchema } from "@/features/listings/schemas";
import { getDb, newId } from "@/mocks/db";
import { ok, parseBody, withUser } from "@/mocks/http";
import { toListingWithSeller } from "@/mocks/serializers";
import type { Listing } from "@/types/domain";

function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export const GET = withUser(async (user, request: Request) => {
  const { searchParams } = new URL(request.url);
  const q = normalize(searchParams.get("q")?.trim() ?? "");
  const campus = searchParams.get("campus");

  const terms = q.split(/\s+/).filter(Boolean);
  const items = getDb()
    .listings.filter((l) => l.status === "disponivel")
    .filter((l) => !campus || l.campus === campus)
    .filter((l) => {
      if (!terms.length) return true;
      const haystack = normalize([l.title, l.description, categoryName(l.category), campusName(l.campus)].join(" "));
      return terms.every((term) => haystack.includes(term));
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((l) => toListingWithSeller(l, user.id));

  return ok({ items, total: items.length });
});

export const POST = withUser(async (user, request: Request) => {
  const { data, error } = await parseBody(request, listingSchema);
  if (error) return error;

  const listing: Listing = {
    id: newId("l"),
    ...data,
    status: "disponivel",
    sellerId: user.id,
    createdAt: new Date().toISOString(),
    conversationsCount: 0,
  };
  getDb().listings.unshift(listing);
  return ok(toListingWithSeller(listing, user.id), { status: 201 });
});
