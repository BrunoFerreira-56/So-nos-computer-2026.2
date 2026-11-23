/**
 * Tela:   Criar anúncio · Criar anúncio com campos faltando
 * Figma:  D08 (83:4866) · D08b (83:4919) · M06 (83:5454)
 * US:     US06, US15
 * RF/RNF: RF06, RNF05
 */
import type { Metadata } from "next";
import { ListingForm } from "@/features/listings/components/listing-form";

export const metadata: Metadata = { title: "Novo anúncio" };

export default function NewListingPage() {
  return <ListingForm />;
}
