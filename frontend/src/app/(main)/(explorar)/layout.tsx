/**
 * Telas com menu lateral: Hub, Favoritos e Meus anúncios (D03, D05, D09).
 */
import type { ReactNode } from "react";
import { MobileBottomNavSpacer } from "@/components/layout/mobile-bottom-nav";
import { SideMenu } from "@/components/layout/side-menu";

export default function ExploreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1">
      <SideMenu />
      <main className="min-w-0 flex-1">
        {children}
        <MobileBottomNavSpacer />
      </main>
    </div>
  );
}
