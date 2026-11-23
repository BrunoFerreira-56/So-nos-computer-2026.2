"use client";

import { Skeleton } from "@heroui/react";
import { useParams } from "next/navigation";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { useSession } from "@/features/auth/hooks";
import { useListing } from "../hooks";
import { ListingForm } from "./listing-form";

/** Editar anúncio (D08c). Só o dono pode editar (US07). */
export function EditListingView() {
  const { id } = useParams<{ id: string }>();
  const { data: listing, isPending, error } = useListing(id);
  const { data: user } = useSession();

  if (isPending || !user) {
    return (
      <div className="flex w-full flex-col gap-4 p-6 lg:w-[480px]" aria-busy="true">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    );
  }

  if (error || !listing || listing.sellerId !== user.id) {
    return (
      <>
        <MobileTopBar title="Editar anúncio" />
        <EmptyState
          className="mt-16"
          icon="lock"
          title={listing ? "Você não pode editar este anúncio" : "Anúncio não encontrado"}
          description={listing ? "Só quem criou o anúncio pode editá-lo ou excluí-lo." : "Ele pode ter sido excluído."}
          action={
            <ButtonLink href="/meus-anuncios" variant="secondary">
              Ver meus anúncios
            </ButtonLink>
          }
        />
      </>
    );
  }

  return <ListingForm key={listing.id} listing={listing} />;
}
