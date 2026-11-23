"use client";

import { Dropdown, Label } from "@heroui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { Icon, type IconName } from "@/components/ui/icon";
import { useSession, useUpdateCampus } from "@/features/auth/hooks";
import { CAMPI, campusName } from "@/lib/constants";
import { cn } from "@/lib/format";
import type { CampusId } from "@/types/domain";

const ITEMS: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Explorar tudo", icon: "grid" },
  { href: "/favoritos", label: "Favoritos", icon: "heart" },
  { href: "/conversas", label: "Conversas", icon: "chat" },
  { href: "/meus-anuncios", label: "Meus anúncios", icon: "tag" },
  { href: "/perfil/me", label: "Meu perfil", icon: "user" },
];

/**
 * Menu lateral (D03, D05, D09). Visível a partir de 1024 px.
 * "Criar novo anúncio" a 1 clique da tela inicial (RNF05).
 */
export function SideMenu() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[296px] shrink-0 border-r border-ut-border lg:block">
      <div className="sticky top-[71px] flex flex-col gap-2 p-4">
        <h2 className="pb-2 type-title-1 text-ut-text">Explorar</h2>
        <ButtonLink href="/anuncios/novo" fullWidth>
          <Icon name="plus" tone="inherit" />
          Criar novo anúncio
        </ButtonLink>

        <nav aria-label="Menu principal" className="mt-2 flex flex-col gap-2">
          {ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-ut-md px-3 py-2 transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-ut-focus",
                  active ? "bg-brand-subtle" : "hover:bg-ut-subtle",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full",
                    active ? "bg-brand" : "bg-ut-muted",
                  )}
                >
                  <Icon name={item.icon} tone="inherit" className={active ? "text-on-brand" : "text-ut-icon"} />
                </span>
                <span className={cn(active ? "type-body-strong text-brand-text" : "type-body text-ut-text")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <hr className="my-2 border-ut-border" />
        <CampusPicker />
      </div>
    </aside>
  );
}

/** "Seu campus · alterar": troca o campus do usuário e filtra o hub por ele (US08). */
function CampusPicker() {
  const router = useRouter();
  const { data: user } = useSession();
  const updateCampus = useUpdateCampus();

  return (
    <div className="flex flex-col gap-1 px-3 py-2">
      <p className="type-title-3 text-ut-text">Seu campus</p>
      <div className="flex items-center gap-1 type-body text-ut-text-secondary">
        <Icon name="map-pin" size={16} />
        <span>{user ? campusName(user.campus) : "…"}</span>
        <span aria-hidden>·</span>
        <Dropdown>
          <Dropdown.Trigger
            aria-label="Alterar seu campus"
            className="cursor-pointer rounded-ut-sm text-ut-text-secondary underline-offset-2 outline-none hover:underline data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-ut-focus"
          >
            alterar
          </Dropdown.Trigger>
          <Dropdown.Popover placement="bottom start" className="max-h-80 min-w-56 overflow-auto">
            <Dropdown.Menu
              aria-label="Escolha seu campus"
              selectionMode="single"
              selectedKeys={user ? [user.campus] : []}
              onAction={(key) => {
                const campus = String(key) as CampusId;
                updateCampus.mutate(campus);
                router.push(`/?campus=${campus}`);
              }}
            >
              {CAMPI.map((campus) => (
                <Dropdown.Item key={campus.id} id={campus.id} textValue={campus.name}>
                  <Label>{campus.name}</Label>
                  <Dropdown.ItemIndicator />
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </div>
  );
}
