"use client";

import { Button, Dropdown, Label, Popover } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ButtonLink, IconLink } from "@/components/ui/button-link";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Logo } from "@/components/ui/logo";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useLogout, useSession } from "@/features/auth/hooks";
import { useConversations } from "@/features/chat/hooks";
import { useFavorites } from "@/features/favorites/hooks";
import { HeaderSearch } from "./header-search";
import { ThemeToggle } from "./theme-toggle";

/**
 * Header/Desktop (27:76). "Vender" e "Chat" ficam a 1 clique de qualquer tela (RNF05 / US15).
 * Escondido abaixo de 768 px, onde a navegação é a barra superior + inferior do mobile.
 */
export function AppHeader() {
  const { data: user } = useSession();
  const { data: favorites } = useFavorites();
  const { data: conversations } = useConversations();
  const hasUnread = conversations?.some((c) => c.unread) ?? false;
  const favoritesCount = favorites?.length ?? 0;

  return (
    <header className="sticky top-0 z-30 hidden items-center gap-6 border-b border-ut-border bg-ut-canvas px-6 py-3 md:flex">
      <Link href="/" aria-label="UTMarket — página inicial" className="shrink-0 rounded-ut-sm">
        <Logo size="md" />
      </Link>

      <Suspense fallback={<div className="h-[46px] flex-1 rounded-full border border-ut-border bg-ut-subtle" />}>
        <HeaderSearch />
      </Suspense>

      <nav aria-label="Ações rápidas" className="flex shrink-0 items-center gap-3">
        <ThemeToggle />

        <IconLink href="/conversas" label={hasUnread ? "Conversas (mensagens não lidas)" : "Conversas"}>
          <Icon name="chat" />
          {hasUnread ? <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-brand" /> : null}
        </IconLink>

        <NotificationsButton />

        <IconLink href="/favoritos" label={`Favoritos (${favoritesCount})`}>
          <Icon name="heart" />
          {favoritesCount > 0 ? (
            <span
              aria-hidden
              className="absolute -top-0.5 -right-1 flex h-[17px] min-w-[18px] items-center justify-center rounded-full bg-ut-icon-accent px-[5px] text-[11px] leading-none font-bold text-on-brand"
            >
              {favoritesCount}
            </span>
          ) : null}
        </IconLink>

        <ButtonLink href="/anuncios/novo" className="hidden lg:inline-flex">
          <Icon name="plus" tone="inherit" />
          Vender
        </ButtonLink>
        <IconLink href="/anuncios/novo" label="Vender" className="border-brand bg-brand hover:bg-brand-hover lg:hidden">
          <Icon name="plus" tone="inherit" className="text-on-brand" />
        </IconLink>

        <UserMenu name={user?.name} />
      </nav>
    </header>
  );
}

function NotificationsButton() {
  return (
    <Popover>
      <IconButton icon="bell" label="Notificações" />
      <Popover.Content placement="bottom end" className="w-72">
        <Popover.Dialog className="flex flex-col items-center gap-2 p-6 text-center">
          <Popover.Heading className="type-title-3">Notificações</Popover.Heading>
          <p className="type-body text-ut-text-secondary">Você não tem notificações novas.</p>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}

function UserMenu({ name }: { name?: string }) {
  const router = useRouter();
  const logout = useLogout();

  return (
    <Dropdown>
      <Button isIconOnly variant="ghost" aria-label="Menu da conta" className="size-10 min-w-10 rounded-full p-0">
        <UserAvatar name={name} />
      </Button>
      <Dropdown.Popover placement="bottom end" className="min-w-52">
        <Dropdown.Menu
          aria-label="Conta"
          onAction={(key) => {
            if (key === "logout") logout.mutate();
            else router.push(String(key));
          }}
        >
          <Dropdown.Item id="/perfil/me" textValue="Meu perfil">
            <Icon name="user" />
            <Label>Meu perfil</Label>
          </Dropdown.Item>
          <Dropdown.Item id="/meus-anuncios" textValue="Meus anúncios">
            <Icon name="tag" />
            <Label>Meus anúncios</Label>
          </Dropdown.Item>
          <Dropdown.Item id="/favoritos" textValue="Favoritos">
            <Icon name="heart" />
            <Label>Favoritos</Label>
          </Dropdown.Item>
          <Dropdown.Item id="logout" textValue="Sair">
            <Icon name="logout" />
            <Label>Sair</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
