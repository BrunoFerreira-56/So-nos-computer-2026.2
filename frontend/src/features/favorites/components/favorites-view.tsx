"use client";

import { MobileTopBar } from "@/components/layout/mobile-top-bar";
import { PageTitle } from "@/components/layout/page-title";
import { AlertBanner } from "@/components/ui/alert-banner";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { LISTING_GRID, ListingCard, ListingCardSkeleton } from "@/features/listings/components/listing-card";
import { pluralize } from "@/lib/format";
import { useFavorites } from "../hooks";

/** Favoritos (D05) — US04 · RF04. Tocar no coração remove o anúncio da lista na hora. */
export function FavoritesView() {
  const { data: favorites, isPending, isError, refetch } = useFavorites();

  const subtitle = favorites
    ? `${pluralize(favorites.length, "anúncio salvo", "anúncios salvos")} · toque no coração para remover`
    : "Carregando…";

  return (
    <>
      <MobileTopBar title="Favoritos" variant="inicio" />
      <div className="flex flex-col gap-6 px-4 pt-4 pb-6 md:px-8 md:pt-8">
        <PageTitle title="Favoritos" subtitle={subtitle} />

        {isError ? (
          <AlertBanner type="error">
            Não foi possível carregar seus favoritos.{" "}
            <button type="button" className="underline" onClick={() => refetch()}>
              Tentar de novo
            </button>
          </AlertBanner>
        ) : isPending ? (
          <div className={LISTING_GRID} aria-busy="true">
            {Array.from({ length: 4 }, (_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <EmptyState
            className="mt-10"
            icon="heart"
            title="Nenhum favorito ainda"
            description="Toque no coração de um anúncio para salvá-lo aqui e encontrá-lo depois."
            action={
              <ButtonLink href="/" variant="secondary">
                Explorar anúncios
              </ButtonLink>
            }
          />
        ) : (
          <ul className={LISTING_GRID}>
            {favorites.map((listing) => (
              <li key={listing.id}>
                <ListingCard listing={listing} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
