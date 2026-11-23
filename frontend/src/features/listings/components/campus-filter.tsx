"use client";

import { Dropdown, Label } from "@heroui/react";
import { FilterChip, filterChipClass } from "@/components/ui/filter-chip";
import { Icon } from "@/components/ui/icon";
import { CAMPI, VISIBLE_CAMPUS_CHIPS } from "@/lib/constants";
import type { CampusId } from "@/types/domain";

interface CampusFilterProps {
  value: CampusId | null;
  onChange: (campus: CampusId | null) => void;
}

/**
 * Filtro por campus (US08 · RF08): "Todos os campus", os 6 primeiros campus como chips e
 * os demais em "Mais campus". Clicar no chip selecionado remove o filtro.
 * No celular a linha rola na horizontal (M02).
 */
export function CampusFilter({ value, onChange }: CampusFilterProps) {
  const visible = CAMPI.slice(0, VISIBLE_CAMPUS_CHIPS);
  const more = CAMPI.slice(VISIBLE_CAMPUS_CHIPS);
  const selectedInMore = more.find((c) => c.id === value);

  return (
    <div
      role="group"
      aria-label="Filtrar por campus"
      className="-mx-4 flex [scrollbar-width:none] items-center gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
    >
      {/* Sem recuo à esquerda: alinha com o título e cabe numa linha mesmo com a barra de rolagem. */}
      <span className="hidden shrink-0 items-center gap-1.5 py-2 pr-2 type-body-strong text-ut-text md:flex">
        <Icon name="filter" size={16} />
        Campus:
      </span>

      <FilterChip selected={value === null} onClick={() => onChange(null)}>
        <span className="md:hidden">Todos</span>
        <span className="hidden md:inline">Todos os campus</span>
      </FilterChip>

      {visible.map((campus) => (
        <FilterChip
          key={campus.id}
          selected={value === campus.id}
          removable
          aria-label={value === campus.id ? `${campus.name} (remover filtro)` : campus.name}
          onClick={() => onChange(value === campus.id ? null : campus.id)}
        >
          {campus.name}
        </FilterChip>
      ))}

      <Dropdown>
        <Dropdown.Trigger className={filterChipClass(Boolean(selectedInMore))}>
          {selectedInMore ? selectedInMore.name : "Mais campus"}
        </Dropdown.Trigger>
        <Dropdown.Popover placement="bottom start" className="max-h-80 min-w-52 overflow-auto">
          <Dropdown.Menu
            aria-label="Outros campus"
            selectionMode="single"
            selectedKeys={selectedInMore ? [selectedInMore.id] : []}
            onAction={(key) => onChange(key === value ? null : (String(key) as CampusId))}
          >
            {more.map((campus) => (
              <Dropdown.Item key={campus.id} id={campus.id} textValue={campus.name}>
                <Label>{campus.name}</Label>
                <Dropdown.ItemIndicator />
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
}
