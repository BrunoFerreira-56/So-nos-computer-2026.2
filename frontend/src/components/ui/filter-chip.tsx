"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/format";
import { Icon } from "./icon";

/** Classes do Chip de filtro (25:171). Exportadas para gatilhos de Dropdown com o mesmo visual. */
export function filterChipClass(selected?: boolean, className?: string) {
  return cn(
    "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 type-body whitespace-nowrap transition-colors",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ut-focus data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-offset-2 data-[focus-visible=true]:outline-ut-focus",
    selected ? "bg-selected text-on-selected" : "border border-ut-border bg-ut-canvas text-ut-text hover:bg-ut-subtle",
    className,
  );
}

interface FilterChipProps extends ComponentProps<"button"> {
  selected?: boolean;
  /** Mostra o "×" no chip selecionado, indicando que clicar remove o filtro (D04). */
  removable?: boolean;
}

/** Chip de filtro (25:171). Usado no filtro de campus e nas abas de conversas e status. */
export function FilterChip({ selected, removable, className, children, ...props }: FilterChipProps) {
  return (
    <button type="button" aria-pressed={selected} {...props} className={filterChipClass(selected, className)}>
      {children}
      {selected && removable ? <Icon name="x" size={16} tone="inherit" /> : null}
    </button>
  );
}
