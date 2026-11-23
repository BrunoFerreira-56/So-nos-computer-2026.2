/**
 * Tela:   Detalhes do anúncio · Reportar anúncio · Denúncia registrada
 * Figma:  D06 (83:4592) · D06b (83:4650) · D06c (83:4724) · M03 (83:5404)
 * US:     US03, US04, US05, US13
 * RF/RNF: RF03, RF04, RF05, RF13
 */
import { Suspense } from "react";
import { ListingDetailSkeleton, ListingDetailView } from "@/features/listings/components/listing-detail-view";

export default function ListingDetailPage() {
  // Suspense: o id da URL só existe em tempo de requisição (Cache Components).
  return (
    <Suspense fallback={<ListingDetailSkeleton />}>
      <ListingDetailView />
    </Suspense>
  );
}
