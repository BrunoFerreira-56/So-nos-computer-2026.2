/**
 * Tela:   Meus anúncios · Alterar status · Vazio · Confirmar exclusão
 * Figma:  D09 (83:5030) · D09a (83:5074) · D09b (83:5129) · D09c (83:5148) · M07 (83:5469) · M07b (83:5506)
 * US:     US07, US10
 * RF/RNF: RF07, RF10
 */
import type { Metadata } from "next";
import { MyListingsView } from "@/features/listings/components/my-listings-view";

export const metadata: Metadata = { title: "Meus anúncios" };

export default function MyListingsPage() {
  return <MyListingsView />;
}
