import type { ReactNode } from "react";
import { cn } from "@/lib/format";
import { Icon, type IconName } from "./icon";

interface EmptyStateProps {
  icon: IconName;
  title: string;
  description: ReactNode;
  /** Botão secundário opcional (ex.: "Limpar filtros", "Criar primeiro anúncio"). */
  action?: ReactNode;
  className?: string;
}

/** Estado vazio (26:116): ícone em círculo amarelo-claro, título, descrição e ação. */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("mx-auto flex max-w-[420px] flex-col items-center gap-4 p-8 text-center", className)}>
      <div className="flex size-20 items-center justify-center rounded-full bg-brand-subtle">
        <Icon name={icon} size={32} />
      </div>
      <p className="type-title-3 text-ut-text">{title}</p>
      <p className="type-body text-ut-text-secondary">{description}</p>
      {action}
    </div>
  );
}
