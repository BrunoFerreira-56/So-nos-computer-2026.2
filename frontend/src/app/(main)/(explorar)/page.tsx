/**
 * Tela:   Hub principal · Hub carregando · Busca sem resultados
 * Figma:  D03 (83:4412) · D03b (83:4455) · D04 (83:4530) · M02 (83:5388)
 * US:     US02, US08, US09, US04 (favoritar no card), US15
 * RF/RNF: RF02, RF04, RF08, RF09, RNF02, RNF04, RNF05
 */
import { Suspense } from "react";
import { HubView } from "@/features/listings/components/hub-view";

export default function HubPage() {
  return (
    <Suspense>
      <HubView />
    </Suspense>
  );
}
