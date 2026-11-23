import { api } from "@/lib/axios";
import type { ListingWithSeller } from "@/types/domain";

export const favoritesApi = {
  list: () => api.get<ListingWithSeller[]>("/me/favorites").then((r) => r.data),
  add: (listingId: string) => api.put(`/me/favorites/${listingId}`).then(() => undefined),
  remove: (listingId: string) => api.delete(`/me/favorites/${listingId}`).then(() => undefined),
};
