"use client";

import { Button, Dropdown, Header, Label } from "@heroui/react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { Icon, type IconName } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { ProductImage } from "@/components/ui/product-image";
import { StatusBadge } from "@/components/ui/status-badge";
import { STATUS_LABEL } from "@/lib/constants";
import { formatPrice, formatRelative, pluralize } from "@/lib/format";
import type { Listing, ListingStatus } from "@/types/domain";

const STATUS_ACTIONS: { status: ListingStatus; label: string; icon: IconName }[] = [
  { status: "disponivel", label: STATUS_LABEL.disponivel, icon: "check" },
  { status: "vendido", label: "Marcar como vendido", icon: "tag" },
  { status: "inativo", label: "Marcar como inativo", icon: "alert" },
];

interface SellerListingRowProps {
  listing: Listing;
  onStatusChange: (status: ListingStatus) => void;
  onDelete: () => void;
  /** Abre as ações no bottom sheet (mobile, M07b). */
  onOpenActions: () => void;
}

/**
 * Linha de anúncio do vendedor (27:380) — US07, US10.
 * Disponível: "Marcar como vendido" abre o menu "Alterar status" (D09a).
 * Vendido/Inativo: "Reativar" volta para Disponível.
 */
export function SellerListingRow({ listing, onStatusChange, onDelete, onOpenActions }: SellerListingRowProps) {
  const available = listing.status === "disponivel";
  const meta = `Publicado ${formatRelative(listing.createdAt)} · ${pluralize(listing.conversationsCount, "conversa", "conversas")}`;

  return (
    <article className="flex items-center gap-3 rounded-ut-md border border-ut-border bg-ut-canvas p-3 md:gap-4 md:p-4">
      <Link
        href={`/anuncios/${listing.id}`}
        className="relative size-16 shrink-0 overflow-hidden rounded-ut-md bg-ut-placeholder md:size-20"
        aria-label={`Ver "${listing.title}"`}
      >
        <ProductImage src={listing.images[0]} alt="" sizes="80px" placeholder="" eager />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link href={`/anuncios/${listing.id}`} className="truncate type-body-strong text-ut-text hover:underline">
          {listing.title}
        </Link>
        <p className="type-body text-ut-text">{formatPrice(listing.priceCents)}</p>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={listing.status} />
          <span className="hidden type-caption text-ut-text-secondary md:inline">{meta}</span>
        </div>
      </div>

      {/* Ações (desktop) */}
      <div className="hidden shrink-0 items-center gap-2 md:flex">
        <ButtonLink href={`/anuncios/${listing.id}/editar`} variant="secondary">
          <Icon name="edit" tone="inherit" />
          Editar
        </ButtonLink>

        {available ? (
          <Dropdown>
            <Button variant="secondary">
              <Icon name="tag" tone="inherit" />
              Marcar como vendido
            </Button>
            <Dropdown.Popover placement="bottom end" className="min-w-60">
              <Dropdown.Menu
                aria-label="Alterar status"
                selectionMode="single"
                selectedKeys={[listing.status]}
                onAction={(key) => onStatusChange(key as ListingStatus)}
              >
                <Dropdown.Section>
                  <Header className="px-2 py-1 type-caption text-ut-text-secondary">Alterar status</Header>
                  {STATUS_ACTIONS.map((action) => (
                    <Dropdown.Item key={action.status} id={action.status} textValue={action.label}>
                      <Icon name={listing.status === action.status ? "check" : action.icon} />
                      <Label className={listing.status === action.status ? "font-semibold" : undefined}>
                        {action.label}
                      </Label>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Section>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        ) : (
          <Button variant="secondary" onPress={() => onStatusChange("disponivel")}>
            <Icon name="check" tone="inherit" />
            Reativar
          </Button>
        )}

        <IconButton icon="trash" label={`Excluir "${listing.title}"`} onPress={onDelete} />
      </div>

      {/* Ações (mobile) */}
      <IconButton icon="more" label={`Ações de "${listing.title}"`} className="md:hidden" onPress={onOpenActions} />
    </article>
  );
}
