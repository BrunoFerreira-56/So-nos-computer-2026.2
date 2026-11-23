"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/format";

interface HeaderSearchProps {
  placeholder?: string;
  className?: string;
}

/**
 * Campo de busca (26:72) — US09 · RF09. Envia para o hub com `?q=`, preservando o
 * filtro de campus. O termo fica na URL, então dá para compartilhar e voltar.
 */
export function HeaderSearch({ placeholder = "Buscar no UTMarket", className }: HeaderSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const currentQuery = pathname === "/" ? (params.get("q") ?? "") : "";
  const [value, setValue] = useState(currentQuery);
  const [syncedQuery, setSyncedQuery] = useState(currentQuery);

  // Mantém o campo igual à URL quando ela muda por fora (ex.: "Limpar filtros").
  if (currentQuery !== syncedQuery) {
    setSyncedQuery(currentQuery);
    setValue(currentQuery);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const next = new URLSearchParams(pathname === "/" ? params.toString() : "");
    const term = value.trim();
    if (term) next.set("q", term);
    else next.delete("q");
    const query = next.toString();
    router.push(query ? `/?${query}` : "/");
  }

  return (
    <form role="search" onSubmit={submit} className={cn("min-w-0 flex-1", className)}>
      <label className="flex w-full items-center gap-2 rounded-full border border-ut-border bg-ut-subtle px-4 py-3 focus-within:border-ut-focus focus-within:shadow-[0_0_0_1px_var(--ut-focus)]">
        <Icon name="search" />
        <span className="sr-only">Buscar anúncios</span>
        <input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent type-body text-ut-text outline-none placeholder:text-ut-text-muted [&::-webkit-search-cancel-button]:hidden"
        />
      </label>
    </form>
  );
}
