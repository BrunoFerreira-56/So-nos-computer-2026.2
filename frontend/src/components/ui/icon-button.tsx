"use client";

import { Button, type ButtonProps } from "@heroui/react";
import { cn } from "@/lib/format";
import { Icon, type IconName } from "./icon";

interface IconButtonProps extends Omit<ButtonProps, "children" | "isIconOnly" | "variant"> {
  icon: IconName;
  /** Nome acessível (obrigatório: o botão só tem ícone). */
  label: string;
  /** Estado "Ativo" do Figma (ex.: anúncio favoritado na tela de detalhes). */
  isActive?: boolean;
  iconTone?: "default" | "accent";
}

/**
 * Botão ícone (83:280): círculo de 40 px com borda. Estados Padrão, Hover e Ativo.
 * Usado para favoritar, reportar, mais opções, voltar e notificações.
 */
export function IconButton({ icon, label, isActive, iconTone = "default", className, ...props }: IconButtonProps) {
  return (
    <Button
      {...props}
      isIconOnly
      variant="ghost"
      aria-label={label}
      aria-pressed={isActive}
      className={cn(
        "size-10 min-w-10 shrink-0 rounded-full border p-0",
        isActive
          ? "border-brand bg-brand-subtle hover:bg-brand-subtle"
          : "border-ut-border bg-ut-canvas hover:bg-ut-subtle",
        className as string | undefined,
      )}
    >
      <Icon name={icon} tone={iconTone} />
    </Button>
  );
}
