"use client";

import { Button } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HeaderSearch } from "@/components/layout/header-search";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";
import { PageTitle } from "@/components/layout/page-title";
import { AlertBanner } from "@/components/ui/alert-banner";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { CAMPI, campusName } from "@/lib/constants";
import { pluralize } from "@/lib/format";
import type { CampusId } from "@/types/domain";
import { useListings } from "../hooks";
import { CampusFilter } from "./campus-filter";
import { LISTING_GRID, ListingCard, ListingCardSkeleton } from "./listing-card";

function parseCampus(value: string | null): CampusId | null {
  return CAMPI.some((c) => c.id === value) ? (value as CampusId) : null;
}

/** Hub principal (D03), carregando (D03b) e busca sem resultados (D04). */
export function HubView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const q = params.get("q")?.trim() ?? "";
  const campus = parseCampus(params.get("campus"));
  const { data, isPending, isError, refetch, isFetching } = useListings({ q, campus });

  function setCampus(next: CampusId | null) {
    const search = new URLSearchParams(params.toString());
    if (next) search.set("campus", next);
    else search.delete("campus");
    const query = search.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const where = campus ? `no Campus ${campusName(campus)}` : "em todos os campus";
  const count = data ? pluralize(data.total, "anúncio", "anúncios") : "";
  const title = q ? `Resultados para "${q}"` : "Anúncios disponíveis";
  const subtitle = isPending
    ? "Carregando anúncios…"
    : q
      ? `${count} ${where}`
      : `${count} ${where} · atualizado agora`;

  return (
    <>
      <MobileTopBar variant="inicio" title="UTMarket" action={<IconButton icon="bell" label="Notificações" />} />

      <div className="flex flex-col gap-4 px-4 pt-4 pb-6 md:gap-6 md:px-8 md:pt-8">
        <HeaderSearch className="md:hidden" />

        <PageTitle title={title} subtitle={subtitle} desktopOnly />

        <CampusFilter value={campus} onChange={setCampus} />

        <h1 className="type-title-2 text-ut-text md:hidden">{q ? title : "Anúncios disponíveis"}</h1>

        {isError ? (
          <AlertBanner type="error">
            Não foi possível carregar os anúncios.{" "}
            <button type="button" className="underline" onClick={() => refetch()}>
              Tentar de novo
            </button>
          </AlertBanner>
        ) : isPending ? (
          <div className={LISTING_GRID} aria-busy="true" aria-label="Carregando anúncios">
            {Array.from({ length: 8 }, (_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <EmptyState
            className="mt-10"
            icon="search"
            title="Nenhum anúncio encontrado"
            description={
              q
                ? `Não encontramos anúncios para "${q}" ${where}. Tente outro termo ou remova o filtro de campus.`
                : `Ainda não há anúncios ${where}. Tente outro campus.`
            }
            action={
              <Button variant="secondary" onPress={() => router.push("/")}>
                Limpar filtros
              </Button>
            }
          />
        ) : (
          <ul className={LISTING_GRID} aria-busy={isFetching}>
            {data.items.map((listing, index) => (
              <li key={listing.id}>
                <ListingCard listing={listing} eager={index < 4} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
