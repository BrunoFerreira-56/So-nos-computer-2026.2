/**
 * Tela:   Favoritos
 * Figma:  D05 (83:4566)
 * US:     US04
 * RF/RNF: RF04
 */
import type { Metadata } from "next";
import { FavoritesView } from "@/features/favorites/components/favorites-view";

export const metadata: Metadata = { title: "Favoritos" };

export default function FavoritesPage() {
  return <FavoritesView />;
}
