"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { Logo } from "@/components/ui/logo";

interface MobileTopBarProps {
  title: string;
  /** "inicio" mostra o logo (M02, M04); "voltar" mostra o botão de voltar (M03, M05, M07). */
  variant?: "inicio" | "voltar";
  /** Destino do "voltar". Sem ele, volta no histórico. */
  backHref?: string;
  /** Ação à direita (sino, "mais opções"…). */
  action?: ReactNode;
}

/** Mobile/Barra superior (27:163). Só aparece abaixo de 768 px. */
export function MobileTopBar({ title, variant = "voltar", backHref, action }: MobileTopBarProps) {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-ut-border bg-ut-canvas px-4 py-3 md:hidden">
      {variant === "inicio" ? (
        <Logo size="sm" withWordmark={false} />
      ) : (
        <IconButton
          icon="chevron-left"
          label="Voltar"
          onPress={() => (backHref ? router.push(backHref) : router.back())}
        />
      )}
      <h1 className="min-w-0 flex-1 truncate type-title-3 text-ut-text">{title}</h1>
      {action ?? <span className="size-10" aria-hidden />}
    </div>
  );
}
