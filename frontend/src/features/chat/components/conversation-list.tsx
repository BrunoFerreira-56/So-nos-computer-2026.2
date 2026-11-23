"use client";

import { Skeleton } from "@heroui/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AlertBanner } from "@/components/ui/alert-banner";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterChip } from "@/components/ui/filter-chip";
import { Icon } from "@/components/ui/icon";
import { UserAvatar } from "@/components/ui/user-avatar";
import { cn, formatTime } from "@/lib/format";
import type { ConversationSummary } from "@/types/domain";
import { useConversations } from "../hooks";

type Filter = "todas" | "comprando" | "vendendo";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "comprando", label: "Comprando" },
  { id: "vendendo", label: "Vendendo" },
];

function normalize(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Lista de conversas (D07 coluna esquerda, M04). */
export function ConversationList() {
  const { id: selectedId } = useParams<{ id?: string }>();
  const { data, isPending, isError } = useConversations();
  const [filter, setFilter] = useState<Filter>("todas");
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    const term = normalize(search.trim());
    return (data ?? [])
      .filter((c) => filter === "todas" || c.role === filter)
      .filter((c) => !term || normalize(`${c.counterpart.name} ${c.listing.title}`).includes(term));
  }, [data, filter, search]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="hidden type-title-1 text-ut-text md:block">Conversas</h1>

      <label className="flex items-center gap-2 rounded-full border border-ut-border bg-ut-subtle px-4 py-3 focus-within:border-ut-focus">
        <Icon name="search" />
        <span className="sr-only">Buscar conversa</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar conversa ou produto"
          className="min-w-0 flex-1 bg-transparent type-body text-ut-text outline-none placeholder:text-ut-text-muted"
        />
      </label>

      <div role="group" aria-label="Filtrar conversas" className="flex gap-2">
        {FILTERS.map((f) => (
          <FilterChip key={f.id} selected={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </FilterChip>
        ))}
      </div>

      {isError ? (
        <AlertBanner type="error">Não foi possível carregar suas conversas.</AlertBanner>
      ) : isPending ? (
        <div className="flex flex-col gap-2" aria-busy="true">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-ut-md" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon="chat"
          title={search ? "Nenhuma conversa encontrada" : "Nenhuma conversa ainda"}
          description={
            search
              ? "Tente buscar pelo nome da pessoa ou do produto."
              : "Abra um anúncio e toque em “Conversar” para falar com quem está vendendo."
          }
          className="p-4"
        />
      ) : (
        <ul className="flex flex-col gap-1">
          {items.map((conversation) => (
            <li key={conversation.id}>
              <ConversationItem conversation={conversation} selected={conversation.id === selectedId} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Item de conversa (27:425): Padrão, Selecionada (fundo amarelo-claro) e Não lida (ponto amarelo). */
function ConversationItem({ conversation, selected }: { conversation: ConversationSummary; selected: boolean }) {
  const { counterpart, lastMessage, listing, unread } = conversation;
  const shortTitle = listing.title.split(" — ")[0];
  return (
    <Link
      href={`/conversas/${conversation.id}`}
      aria-current={selected ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-ut-md px-3 py-3 transition-colors",
        "focus-visible:outline-2 focus-visible:outline-ut-focus",
        selected ? "bg-brand-subtle" : "hover:bg-ut-subtle",
      )}
    >
      <UserAvatar name={counterpart.name} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className={cn("truncate text-ut-text", unread ? "type-body-strong" : "type-body")}>
            {counterpart.name}
          </span>
          {lastMessage ? (
            <span className="shrink-0 type-caption text-ut-text-secondary">{formatTime(lastMessage.createdAt)}</span>
          ) : null}
        </div>
        <p className="truncate type-caption text-ut-text-secondary">
          {shortTitle}
          {lastMessage ? ` · ${lastMessage.text}` : ""}
        </p>
      </div>
      {unread ? (
        <span className="size-2 shrink-0 rounded-full bg-brand">
          <span className="sr-only">Mensagens não lidas</span>
        </span>
      ) : null}
    </Link>
  );
}
