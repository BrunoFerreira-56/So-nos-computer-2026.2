import { buttonVariants } from "@heroui/react";
import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/format";

interface ButtonLinkProps extends LinkProps<string> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Link de navegação com a aparência do Botão do HeroUI/Figma (25:144).
 * Use quando a ação leva a outra página (ex.: "Vender", "Criar anúncio").
 */
export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link {...props} className={cn(buttonVariants({ variant, size, fullWidth }), className)}>
      {children}
    </Link>
  );
}

interface IconLinkProps extends LinkProps<string> {
  label: string;
  className?: string;
  children: ReactNode;
}

/** Link com a aparência do Botão ícone (83:280). */
export function IconLink({ label, className, children, ...props }: IconLinkProps) {
  return (
    <Link
      {...props}
      aria-label={label}
      className={cn(
        "relative inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-ut-border bg-ut-canvas transition-colors hover:bg-ut-subtle",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ut-focus",
        className,
      )}
    >
      {children}
    </Link>
  );
}
