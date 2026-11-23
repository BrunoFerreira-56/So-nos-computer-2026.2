/**
 * Layout das telas logadas: header desktop (≥ 768 px) e navegação inferior no mobile.
 * Cada página mobile desenha sua própria barra superior (MobileTopBar), porque título e
 * ações mudam por tela (M02–M07).
 */
import { Suspense, type ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />
      <div className="flex flex-1 flex-col">{children}</div>
      {/* Suspense: a barra lê a rota atual, que em rotas dinâmicas só existe na requisição. */}
      <Suspense>
        <MobileBottomNav />
      </Suspense>
    </div>
  );
}
