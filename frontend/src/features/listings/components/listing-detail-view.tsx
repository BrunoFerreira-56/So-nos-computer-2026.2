"use client";

import { Button, Dropdown, Input, Label, Skeleton } from "@heroui/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";
import { AlertBanner } from "@/components/ui/alert-banner";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { notify, notifyError } from "@/components/ui/notify";
import { StatusBadge } from "@/components/ui/status-badge";
import { useSession } from "@/features/auth/hooks";
import { useStartConversation } from "@/features/chat/hooks";
import { useToggleFavorite } from "@/features/favorites/hooks";
import { ReportModal } from "@/features/reports/components/report-modal";
import { campusName, categoryName, conditionName } from "@/lib/constants";
import { cn, formatPrice, formatRelative, sellerWord } from "@/lib/format";
import type { ListingWithSeller } from "@/types/domain";
import { useListing } from "../hooks";
import { ListingGallery } from "./listing-gallery";
import { SellerCardLink, SellerSummary } from "./seller-summary";

/** Detalhes do anúncio (D06, M03) com denúncia (D06b) e toast (D06c). */
export function ListingDetailView() {
  const { id } = useParams<{ id: string }>();
  const { data: listing, isPending, error } = useListing(id);

  if (isPending) return <ListingDetailSkeleton />;
  if (error || !listing) {
    return (
      <>
        <MobileTopBar title="Detalhes do anúncio" backHref="/" />
        <EmptyState
          className="mt-16"
          icon="search"
          title="Anúncio não encontrado"
          description="Ele pode ter sido excluído pelo anunciante."
          action={
            <ButtonLink href="/" variant="secondary">
              Voltar aos anúncios
            </ButtonLink>
          }
        />
      </>
    );
  }
  return <ListingDetail listing={listing} />;
}

function ListingDetail({ listing }: { listing: ListingWithSeller }) {
  const router = useRouter();
  const { data: user } = useSession();
  const toggleFavorite = useToggleFavorite();
  const startConversation = useStartConversation();
  const [reportOpen, setReportOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState("Oi, esse item ainda está disponível?");

  const isOwner = user?.id === listing.sellerId;
  const available = listing.status === "disponivel";
  const seller = sellerWord(listing.seller.gender);
  const longDescription = listing.description.length > 140;

  function contact(text?: string) {
    startConversation.mutate(
      { listingId: listing.id, message: text?.trim() || undefined },
      { onError: (e) => notifyError(e.message) },
    );
  }

  function sendQuickMessage(event: FormEvent) {
    event.preventDefault();
    if (message.trim()) contact(message);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    notify("Link do anúncio copiado.");
  }

  const favoriteButton = (
    <IconButton
      icon={listing.isFavorite ? "heart-filled" : "heart"}
      iconTone={listing.isFavorite ? "accent" : "default"}
      isActive={listing.isFavorite}
      label={listing.isFavorite ? "Remover dos favoritos" : "Favoritar"}
      onPress={() => toggleFavorite.mutate({ listing, isFavorite: !listing.isFavorite })}
    />
  );

  const moreMenu = (
    <Dropdown>
      <IconButton icon="more" label="Mais opções" />
      <Dropdown.Popover placement="bottom end" className="min-w-56">
        <Dropdown.Menu
          aria-label="Mais opções do anúncio"
          onAction={(key) => {
            if (key === "copy") void copyLink();
            if (key === "profile") router.push(`/perfil/${listing.sellerId}`);
            if (key === "edit") router.push(`/anuncios/${listing.id}/editar`);
            if (key === "report") setReportOpen(true);
          }}
        >
          {isOwner ? (
            <Dropdown.Item id="edit" textValue="Editar anúncio">
              <Icon name="edit" />
              <Label>Editar anúncio</Label>
            </Dropdown.Item>
          ) : (
            <Dropdown.Item id="profile" textValue={`Ver perfil de ${listing.seller.name}`}>
              <Icon name="user" />
              <Label>Ver perfil de {listing.seller.name}</Label>
            </Dropdown.Item>
          )}
          <Dropdown.Item id="copy" textValue="Copiar link">
            <Icon name="send" />
            <Label>Copiar link do anúncio</Label>
          </Dropdown.Item>
          {!isOwner ? (
            <Dropdown.Item id="report" textValue="Reportar anúncio">
              <Icon name="flag" />
              <Label>Reportar anúncio</Label>
            </Dropdown.Item>
          ) : null}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );

  const details: [string, string][] = [
    ["Condição", conditionName(listing.condition)],
    ["Categoria", categoryName(listing.category)],
    ["Retirada", listing.pickup || "Combinar pelo chat"],
  ];

  return (
    <>
      <MobileTopBar title="Detalhes do anúncio" action={moreMenu} />

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Coluna da mídia */}
        <section className="flex flex-col gap-6 bg-ut-subtle md:flex-1 md:p-8">
          <Link
            href="/"
            className="hidden w-fit items-center gap-1 rounded-ut-sm type-body-strong text-ut-text hover:underline md:inline-flex"
          >
            <Icon name="chevron-left" size={16} />
            Voltar aos anúncios
          </Link>
          <ListingGallery images={listing.images} title={listing.title} />
        </section>

        {/* Coluna de informações */}
        <section className="flex flex-col gap-6 px-4 pt-4 pb-28 md:w-[460px] md:shrink-0 md:border-l md:border-ut-border md:p-6">
          <div className="flex flex-col gap-2">
            <h1 className="type-title-2 text-ut-text md:type-title-1">{listing.title}</h1>
            <p className="type-display text-ut-text">{formatPrice(listing.priceCents)}</p>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={listing.status} />
              <span className="type-caption text-ut-text-secondary">
                <span className="hidden md:inline">Publicado </span>
                {formatRelative(listing.createdAt)} · <span className="hidden md:inline">Campus </span>
                {campusName(listing.campus)}
              </span>
            </div>
          </div>

          {!available && !isOwner ? (
            <AlertBanner type="info">Este anúncio não está mais disponível.</AlertBanner>
          ) : null}

          {/* Ações (desktop) */}
          <div className="hidden items-center gap-3 md:flex">
            {isOwner ? (
              <ButtonLink href={`/anuncios/${listing.id}/editar`} className="flex-1">
                <Icon name="edit" tone="inherit" />
                Editar anúncio
              </ButtonLink>
            ) : (
              <Button
                className="flex-1"
                isDisabled={!available}
                isPending={startConversation.isPending}
                onPress={() => contact()}
              >
                <Icon name="chat" tone="inherit" />
                Conversar com {listing.seller.gender === "a" ? "a" : "o"} {seller}
              </Button>
            )}
            {favoriteButton}
            {!isOwner ? <IconButton icon="flag" label="Reportar anúncio" onPress={() => setReportOpen(true)} /> : null}
            {moreMenu}
          </div>

          {/* Ações (mobile, M03) */}
          <div className="grid grid-cols-3 gap-2 md:hidden">
            <Button
              variant="secondary"
              onPress={() => toggleFavorite.mutate({ listing, isFavorite: !listing.isFavorite })}
            >
              <Icon
                name={listing.isFavorite ? "heart-filled" : "heart"}
                tone={listing.isFavorite ? "accent" : "inherit"}
              />
              {listing.isFavorite ? "Salvo" : "Favoritar"}
            </Button>
            <Button variant="secondary" isDisabled={isOwner} onPress={() => setReportOpen(true)}>
              <Icon name="flag" tone="inherit" />
              Reportar
            </Button>
            <ButtonLink href={`/perfil/${listing.sellerId}`} variant="secondary">
              <Icon name="user" tone="inherit" />
              Perfil
            </ButtonLink>
          </div>

          <hr className="hidden border-ut-border md:block" />

          <section className="flex flex-col gap-3" aria-labelledby="details-heading">
            <h2 id="details-heading" className="type-title-3 text-ut-text">
              Detalhes
            </h2>
            <dl className="hidden grid-cols-[136px_1fr] gap-x-2 gap-y-3 type-body md:grid">
              {details.map(([term, value]) => (
                <div key={term} className="contents">
                  <dt className="text-ut-text-secondary">{term}</dt>
                  <dd className="text-ut-text">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="type-body text-ut-text-secondary md:hidden">
              Condição: {conditionName(listing.condition)}. Retirada: {listing.pickup || "combinar pelo chat"}.
            </p>
            <p
              className={cn(
                "type-body whitespace-pre-line text-ut-text",
                !expanded && longDescription && "line-clamp-3",
              )}
            >
              {listing.description}
            </p>
            {longDescription ? (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="w-fit cursor-pointer type-body-strong text-ut-link underline underline-offset-2"
              >
                {expanded ? "Ver menos" : "Ver mais"}
              </button>
            ) : null}
          </section>

          <hr className="hidden border-ut-border md:block" />

          <div className="hidden md:block">
            <SellerSummary seller={listing.seller} />
          </div>
          <div className="md:hidden">
            <SellerCardLink seller={listing.seller} />
          </div>

          {!isOwner && available ? (
            <form
              onSubmit={sendQuickMessage}
              className="hidden flex-col gap-3 rounded-ut-md bg-ut-subtle p-4 md:flex"
              aria-labelledby="quick-message"
            >
              <p id="quick-message" className="flex items-center gap-2 type-body-strong text-ut-text">
                <Icon name="chat" />
                Envie uma mensagem {listing.seller.gender === "a" ? "à" : "ao"} {seller}
              </p>
              <div className="flex gap-2">
                <Input
                  aria-label="Mensagem para o anunciante"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="min-w-0 flex-1"
                />
                <Button type="submit" isPending={startConversation.isPending}>
                  Enviar
                </Button>
              </div>
            </form>
          ) : null}
        </section>
      </div>

      {/* CTA fixo no rodapé (M03) */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ut-border bg-ut-canvas px-4 py-3 md:hidden">
        {isOwner ? (
          <ButtonLink href={`/anuncios/${listing.id}/editar`} fullWidth>
            <Icon name="edit" tone="inherit" />
            Editar anúncio
          </ButtonLink>
        ) : (
          <Button fullWidth isDisabled={!available} isPending={startConversation.isPending} onPress={() => contact()}>
            <Icon name="chat" tone="inherit" />
            Conversar com {listing.seller.gender === "a" ? "a" : "o"} {seller}
          </Button>
        )}
      </div>

      <ReportModal
        isOpen={reportOpen}
        onOpenChange={setReportOpen}
        target={{ type: "listing", id: listing.id, name: listing.title }}
      />
    </>
  );
}

export function ListingDetailSkeleton() {
  return (
    <div className="flex flex-1 flex-col md:flex-row" aria-busy="true" aria-label="Carregando anúncio">
      <div className="bg-ut-subtle md:flex-1 md:p-8">
        <Skeleton className="aspect-[390/280] w-full md:aspect-[914/763] md:rounded-ut-md" />
      </div>
      <div className="flex flex-col gap-4 p-4 md:w-[460px] md:p-6">
        <Skeleton className="h-8 w-4/5" />
        <Skeleton className="h-10 w-2/5" />
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
