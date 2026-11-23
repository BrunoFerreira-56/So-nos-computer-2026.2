"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/format";

const TABS: { href: string; label: string; icon: IconName; match: (path: string) => boolean }[] = [
  { href: "/", label: "Início", icon: "home", match: (p) => p === "/" },
  { href: "/favoritos", label: "Favoritos", icon: "heart", match: (p) => p.startsWith("/favoritos") },
  { href: "/anuncios/novo", label: "Vender", icon: "plus", match: (p) => p === "/anuncios/novo" },
  { href: "/conversas", label: "Chat", icon: "chat", match: (p) => p.startsWith("/conversas") },
  {
    href: "/perfil/me",
    label: "Perfil",
    icon: "user",
    match: (p) => p.startsWith("/perfil/me") || p.startsWith("/meus-anuncios"),
  },
];

/**
 * Telas com ação fixa no rodapé (CTA, campo de mensagem, publicar) escondem a barra,
 * como no Figma M03, M05 e M06.
 */
const HIDDEN_ON = [/^\/anuncios\/[^/]+$/, /^\/anuncios\/[^/]+\/editar$/, /^\/conversas\/[^/]+$/];

/** Mobile/Navegação inferior (27:175). "Vender" e "Chat" a 1 toque (RNF05). */
export function MobileBottomNav() {
  const pathname = usePathname();
  if (HIDDEN_ON.some((pattern) => pattern.test(pathname))) return null;

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-30 flex items-center border-t border-ut-border bg-ut-canvas px-2 pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {TABS.map((tab) => {
        const active = tab.match(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className="flex flex-1 flex-col items-center gap-1 py-2 focus-visible:outline-2 focus-visible:outline-ut-focus"
          >
            <Icon name={tab.icon} tone="inherit" className={active ? "text-brand-text" : "text-ut-icon"} />
            <span className={cn("type-caption", active ? "font-semibold text-brand-text" : "text-ut-text-secondary")}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

/** Espaço reservado no fim da página para a barra fixa não cobrir conteúdo. */
export function MobileBottomNavSpacer() {
  return <div className="h-[72px] md:hidden" aria-hidden />;
}
