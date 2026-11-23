"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import type { ListingStatus, MyListingsSummary } from "@/types/domain";
import { listingsApi, type ListingFilters } from "./api";
import type { ListingInput } from "./schemas";

/** Hub, busca e filtro de campus (US02, US08, US09). */
export function useListings(filters: ListingFilters) {
  return useQuery({
    queryKey: queryKeys.listings.list(filters),
    queryFn: () => listingsApi.list(filters),
    placeholderData: keepPreviousData,
  });
}

export function useListing(id: string) {
  return useQuery({ queryKey: queryKeys.listings.detail(id), queryFn: () => listingsApi.get(id) });
}

export function useMyListings() {
  return useQuery({ queryKey: queryKeys.listings.mine, queryFn: listingsApi.mine });
}

/** Qualquer mudança em anúncio afeta hub, detalhes, "meus anúncios", favoritos e perfis. */
function useInvalidateListings() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites }),
      queryClient.invalidateQueries({ queryKey: ["profiles"] }),
    ]);
}

export function useCreateListing() {
  const invalidate = useInvalidateListings();
  return useMutation({ mutationFn: listingsApi.create, onSuccess: invalidate });
}

export function useUpdateListing(id: string) {
  const invalidate = useInvalidateListings();
  return useMutation({
    mutationFn: (input: ListingInput) => listingsApi.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateListings();
  return useMutation({
    mutationFn: listingsApi.remove,
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.listings.detail(id) });
      return invalidate();
    },
  });
}

/** Troca de status com atualização otimista na tela "Meus anúncios" (US10). */
export function useSetListingStatus() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateListings();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ListingStatus }) => listingsApi.setStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.listings.mine });
      const previous = queryClient.getQueryData<MyListingsSummary>(queryKeys.listings.mine);
      if (previous) {
        const listings = previous.listings.map((l) => (l.id === id ? { ...l, status } : l));
        queryClient.setQueryData<MyListingsSummary>(queryKeys.listings.mine, {
          listings,
          counts: {
            ...previous.counts,
            disponivel: listings.filter((l) => l.status === "disponivel").length,
            vendido: listings.filter((l) => l.status === "vendido").length,
            inativo: listings.filter((l) => l.status === "inativo").length,
          },
        });
      }
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(queryKeys.listings.mine, context.previous);
    },
    onSettled: invalidate,
  });
}
