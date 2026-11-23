"use client";

import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import type { ListingWithSeller, PublicProfile } from "@/types/domain";
import { favoritesApi } from "./api";

/** Anúncios favoritados (D05). Também alimenta o contador do header. */
export function useFavorites() {
  return useQuery({ queryKey: queryKeys.favorites, queryFn: favoritesApi.list });
}

type ListPage = { items: ListingWithSeller[]; total: number };

/** Aplica o novo estado de favorito em todos os caches que mostram o anúncio. */
function patchFavoriteEverywhere(queryClient: QueryClient, listing: ListingWithSeller, isFavorite: boolean) {
  const patch = (l: ListingWithSeller) => (l.id === listing.id ? { ...l, isFavorite } : l);

  queryClient.setQueriesData<ListPage>({ queryKey: ["listings", "list"] }, (page) =>
    page ? { ...page, items: page.items.map(patch) } : page,
  );
  queryClient.setQueryData<ListingWithSeller>(queryKeys.listings.detail(listing.id), (l) =>
    l ? { ...l, isFavorite } : l,
  );
  queryClient.setQueriesData<PublicProfile>({ queryKey: ["profiles"] }, (profile) =>
    profile ? { ...profile, listings: profile.listings.map(patch) } : profile,
  );
  queryClient.setQueryData<ListingWithSeller[]>(queryKeys.favorites, (favorites) => {
    if (!favorites) return favorites;
    const without = favorites.filter((l) => l.id !== listing.id);
    return isFavorite ? [{ ...listing, isFavorite: true }, ...without] : without;
  });
}

/**
 * Favoritar/desfavoritar com atualização otimista (US04): o coração muda na hora,
 * e volta ao estado anterior se a API falhar.
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listing, isFavorite }: { listing: ListingWithSeller; isFavorite: boolean }) =>
      isFavorite ? favoritesApi.add(listing.id) : favoritesApi.remove(listing.id),
    onMutate: async ({ listing, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites });
      patchFavoriteEverywhere(queryClient, listing, isFavorite);
    },
    onError: (_error, { listing, isFavorite }) => {
      patchFavoriteEverywhere(queryClient, listing, !isFavorite);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.favorites }),
  });
}
