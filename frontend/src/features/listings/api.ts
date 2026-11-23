import { api } from "@/lib/axios";
import type { CampusId, ListingStatus, ListingWithSeller, MyListingsSummary } from "@/types/domain";
import type { ListingInput } from "./schemas";

export interface ListingFilters {
  q?: string;
  campus?: CampusId | null;
}

export const listingsApi = {
  list: (filters: ListingFilters) =>
    api
      .get<{ items: ListingWithSeller[]; total: number }>("/listings", {
        params: { q: filters.q || undefined, campus: filters.campus || undefined },
      })
      .then((r) => r.data),
  get: (id: string) => api.get<ListingWithSeller>(`/listings/${id}`).then((r) => r.data),
  mine: () => api.get<MyListingsSummary>("/me/listings").then((r) => r.data),
  create: (input: ListingInput) => api.post<ListingWithSeller>("/listings", input).then((r) => r.data),
  update: (id: string, input: ListingInput) =>
    api.patch<ListingWithSeller>(`/listings/${id}`, input).then((r) => r.data),
  remove: (id: string) => api.delete(`/listings/${id}`).then(() => undefined),
  setStatus: (id: string, status: ListingStatus) =>
    api.patch<ListingWithSeller>(`/listings/${id}/status`, { status }).then((r) => r.data),
};
