"use client";

import { Skeleton } from "@heroui/react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { ProductImage } from "@/components/ui/product-image";
import { useToggleFavorite } from "@/features/favorites/hooks";
import { campusName } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import type { ListingWithSeller } from "@/types/domain";

interface ListingCardProps {
  listing: ListingWithSeller;
  /** Carrega a imagem já, com prioridade (primeira linha do hub). */
  eager?: boolean;
}

/**
 * Card de anúncio (27:261) — US02, US03, US04.
 * O card inteiro abre os detalhes; o coração favorita direto da listagem.
 */
export function ListingCard({ listing, eager }: ListingCardProps) {
  const toggleFavorite = useToggleFavorite();
  const campus = campusName(listing.campus);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-ut-lg border border-ut-border bg-ut-canvas transition-[border-color,box-shadow] hover:border-ut-border-strong hover:shadow-ut-card">
      <div className="relative aspect-[250/180] w-full overflow-hidden bg-ut-placeholder">
        <ProductImage src={listing.images[0]} alt="" eager={eager} />
      </div>

      <div className="flex flex-col gap-1 p-3">
        <p className="type-price text-ut-text">{formatPrice(listing.priceCents)}</p>
        <h3 className="line-clamp-2 type-body text-ut-text">
          {/* Link "esticado": cobre o card todo sem aninhar o botão de favoritar dentro do link. */}
          <Link
            href={`/anuncios/${listing.id}`}
            className="outline-none after:absolute after:inset-0 after:rounded-ut-lg focus-visible:after:outline-2 focus-visible:after:outline-ut-focus"
          >
            {listing.title}
          </Link>
        </h3>
        <p className="flex items-center gap-1 type-caption text-ut-text-secondary">
          <Icon name="map-pin" size={14} />
          {/* Mobile (M02) mostra só o nome; desktop (D03) usa "Campus …". */}
          <span className="truncate">
            <span className="hidden md:inline">Campus </span>
            {campus}
          </span>
        </p>
      </div>

      <IconButton
        icon={listing.isFavorite ? "heart-filled" : "heart"}
        iconTone={listing.isFavorite ? "accent" : "default"}
        label={listing.isFavorite ? `Remover "${listing.title}" dos favoritos` : `Favoritar "${listing.title}"`}
        onPress={() => toggleFavorite.mutate({ listing, isFavorite: !listing.isFavorite })}
        className="absolute top-2 right-2 z-10"
      />
    </article>
  );
}

/** Esqueleto do card durante o carregamento (D03b). */
export function ListingCardSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      <Skeleton className="aspect-[250/180] w-full rounded-ut-lg" />
      <Skeleton className="h-4 w-1/3 rounded-ut-sm" />
      <Skeleton className="h-3.5 w-4/5 rounded-ut-sm" />
      <Skeleton className="h-3 w-3/5 rounded-ut-sm" />
    </div>
  );
}

/** Grade responsiva de cards: 2 colunas no celular (M02) até 4 no desktop (D03). */
export const LISTING_GRID = "grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4";
