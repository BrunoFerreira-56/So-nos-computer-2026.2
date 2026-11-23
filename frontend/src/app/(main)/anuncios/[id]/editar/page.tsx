/**
 * Tela:   Editar anúncio
 * Figma:  D08c (83:4973)
 * US:     US07
 * RF/RNF: RF07
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { EditListingView } from "@/features/listings/components/edit-listing-view";

export const metadata: Metadata = { title: "Editar anúncio" };

export default function EditListingPage() {
  return (
    <Suspense>
      <EditListingView />
    </Suspense>
  );
}
