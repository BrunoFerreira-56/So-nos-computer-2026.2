"use client";

import { Sheet, Skeleton } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";
import { PageTitle } from "@/components/layout/page-title";
import { AlertBanner } from "@/components/ui/alert-banner";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterChip } from "@/components/ui/filter-chip";
import { Icon, type IconName } from "@/components/ui/icon";
import { notify, notifyError } from "@/components/ui/notify";
import { STATUS_LABEL } from "@/lib/constants";
import type { Listing, ListingStatus } from "@/types/domain";
import { useMyListings, useSetListingStatus } from "../hooks";
import { DeleteListingModal } from "./delete-listing-modal";
import { SellerListingRow } from "./seller-listing-row";

type Filter = "todos" | ListingStatus;

const STATUS_TOAST: Record<ListingStatus, string> = {
  disponivel: "Anúncio reativado. Ele voltou a aparecer no hub.",
  vendido: "Anúncio marcado como vendido.",
  inativo: "Anúncio marcado como inativo.",
};

/** Meus anúncios (D09, D09a, D09b, D09c, M07, M07b) — US07, US10 · RF07, RF10. */
export function MyListingsView() {
  const router = useRouter();
  const { data, isPending, isError, refetch } = useMyListings();
  const setStatus = useSetListingStatus();
  const [filter, setFilter] = useState<Filter>("todos");
  const [toDelete, setToDelete] = useState<Listing | null>(null);
  const [sheetListing, setSheetListing] = useState<Listing | null>(null);

  const closeSheet = () => setSheetListing(null);

  function changeStatus(listing: Listing, status: ListingStatus) {
    if (listing.status === status) return;
    setStatus.mutate(
      { id: listing.id, status },
      { onSuccess: () => notify(STATUS_TOAST[status]), onError: (e) => notifyError(e.message) },
    );
  }

  const header = (
    <PageTitle
      title="Meus anúncios"
      subtitle="Gerencie seus anúncios e acompanhe as conversas"
      desktopOnly
      action={
        <ButtonLink href="/anuncios/novo">
          <Icon name="plus" tone="inherit" />
          Criar anúncio
        </ButtonLink>
      }
    />
  );

  let body: ReactNode;
  if (isError) {
    body = (
      <AlertBanner type="error">
        Não foi possível carregar seus anúncios.{" "}
        <button type="button" className="underline" onClick={() => refetch()}>
          Tentar de novo
        </button>
      </AlertBanner>
    );
  } else if (isPending) {
    body = (
      <div className="flex flex-col gap-3" aria-busy="true">
        <div className="hidden grid-cols-4 gap-4 md:grid">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-ut-md" />
          ))}
        </div>
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-[112px] rounded-ut-md" />
        ))}
      </div>
    );
  } else if (data.listings.length === 0) {
    body = (
      <EmptyState
        className="mt-16"
        icon="send"
        title="Você ainda não tem anúncios"
        description="Quando você começar a vender, seus anúncios aparecerão aqui."
        action={
          <ButtonLink href="/anuncios/novo" variant="secondary">
            Criar primeiro anúncio
          </ButtonLink>
        }
      />
    );
  } else {
    const { counts } = data;
    const filters: { id: Filter; label: string; count: number }[] = [
      { id: "todos", label: "Todos", count: data.listings.length },
      { id: "disponivel", label: STATUS_LABEL.disponivel, count: counts.disponivel },
      { id: "vendido", label: STATUS_LABEL.vendido, count: counts.vendido },
      { id: "inativo", label: STATUS_LABEL.inativo, count: counts.inativo },
    ];
    const visible = data.listings.filter((l) => filter === "todos" || l.status === filter);

    body = (
      <>
        <div className="hidden grid-cols-2 gap-4 md:grid lg:grid-cols-4">
          <StatCard icon="tag" value={counts.disponivel} label="Disponíveis" />
          <StatCard icon="check" value={counts.vendido} label="Vendidos" />
          <StatCard icon="alert" value={counts.inativo} label="Inativos" />
          <StatCard icon="chat" value={counts.conversasAbertas} label="Conversas abertas" />
        </div>

        <div
          role="group"
          aria-label="Filtrar por status"
          className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 md:mx-0 md:px-0"
        >
          {filters.map((f) => (
            <FilterChip key={f.id} selected={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
              {/* No celular (M07) só "Todos" mostra o total. */}
              <span className={f.id === "todos" ? undefined : "hidden md:inline"}> ({f.count})</span>
            </FilterChip>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="py-8 text-center type-body text-ut-text-secondary">Nenhum anúncio com este status.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {visible.map((listing) => (
              <li key={listing.id}>
                <SellerListingRow
                  listing={listing}
                  onStatusChange={(status) => changeStatus(listing, status)}
                  onDelete={() => setToDelete(listing)}
                  onOpenActions={() => setSheetListing(listing)}
                />
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }

  return (
    <>
      <MobileTopBar title="Meus anúncios" backHref="/perfil/me" />
      <div className="flex flex-col gap-6 px-4 pt-4 pb-6 md:px-8 md:pt-8">
        {header}
        {body}
      </div>

      <DeleteListingModal listing={toDelete} onOpenChange={(open) => !open && setToDelete(null)} />

      {/* Ações do anúncio no celular (M07b) */}
      <Sheet isOpen={sheetListing !== null} onOpenChange={(open) => !open && setSheetListing(null)}>
        <Sheet.Backdrop>
          <Sheet.Content className="mx-auto w-full max-w-[480px]">
            <Sheet.Dialog>
              <Sheet.Handle />
              <Sheet.Header>
                <Sheet.Heading className="type-title-3">{sheetListing?.title}</Sheet.Heading>
              </Sheet.Header>
              <Sheet.Body className="flex flex-col pb-4">
                {sheetListing ? (
                  <>
                    <SheetAction
                      icon="edit"
                      label="Editar anúncio"
                      onClose={closeSheet}
                      onPress={() => router.push(`/anuncios/${sheetListing.id}/editar`)}
                    />
                    {sheetListing.status === "disponivel" ? (
                      <>
                        <SheetAction
                          icon="tag"
                          label="Marcar como vendido"
                          onClose={closeSheet}
                          onPress={() => changeStatus(sheetListing, "vendido")}
                        />
                        <SheetAction
                          icon="alert"
                          label="Marcar como inativo"
                          onClose={closeSheet}
                          onPress={() => changeStatus(sheetListing, "inativo")}
                        />
                      </>
                    ) : (
                      <SheetAction
                        icon="check"
                        label="Reativar anúncio"
                        onClose={closeSheet}
                        onPress={() => changeStatus(sheetListing, "disponivel")}
                      />
                    )}
                    <SheetAction
                      icon="trash"
                      label="Excluir anúncio"
                      onClose={closeSheet}
                      onPress={() => setToDelete(sheetListing)}
                    />
                  </>
                ) : null}
              </Sheet.Body>
            </Sheet.Dialog>
          </Sheet.Content>
        </Sheet.Backdrop>
      </Sheet>
    </>
  );
}

/** Ação do bottom sheet: fecha o sheet e executa a ação. */
function SheetAction({
  icon,
  label,
  onPress,
  onClose,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  onClose: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        onClose();
        onPress();
      }}
      className="flex w-full cursor-pointer items-center gap-3 rounded-ut-md px-1 py-3 text-left type-body text-ut-text hover:bg-ut-subtle focus-visible:outline-2 focus-visible:outline-ut-focus"
    >
      <Icon name={icon} />
      {label}
    </button>
  );
}

function StatCard({ icon, value, label }: { icon: IconName; value: number; label: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-ut-md border border-ut-border p-4">
      <Icon name={icon} />
      <p className="type-title-1 text-ut-text">{value}</p>
      <p className="type-body text-ut-text-secondary">{label}</p>
    </div>
  );
}
