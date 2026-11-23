import type { ReactNode } from "react";
import { cn } from "@/lib/format";

interface PageTitleProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Ação à direita do título (ex.: "Criar anúncio" em Meus anúncios). */
  action?: ReactNode;
  /** No mobile o título já está na barra superior; aqui ele pode ficar só no desktop. */
  desktopOnly?: boolean;
  className?: string;
}

/** "Título da seção" do Figma: Título 1 + legenda em cinza. */
export function PageTitle({ title, subtitle, action, desktopOnly, className }: PageTitleProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", desktopOnly && "hidden md:flex", className)}>
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="type-title-1 text-ut-text">{title}</h1>
        {subtitle ? <p className="type-body text-ut-text-secondary">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
