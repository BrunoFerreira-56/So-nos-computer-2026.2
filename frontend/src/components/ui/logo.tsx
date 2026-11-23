import Image from "next/image";
import { cn } from "@/lib/format";

/** Alturas do logo no Figma: barra mobile (20), header desktop (26) e telas de login (30). */
const SIZES = { sm: 20, md: 26, lg: 30 } as const;
/** Proporção do SVG original (145 × 73). */
const RATIO = 145 / 73;

interface LogoProps {
  size?: keyof typeof SIZES;
  /** Mostra o texto "UTMarket" ao lado do símbolo. */
  withWordmark?: boolean;
  /** Animação de entrada do Figma (usada nas telas de autenticação). */
  animated?: boolean;
  className?: string;
}

/**
 * Logo/UTMarket (nó 93:10679). O Figma liga a cor da base ao token color/logo/base,
 * então há uma versão clara e uma escura do SVG, trocadas pelo tema.
 */
export function Logo({ size = "md", withWordmark = true, animated = false, className }: LogoProps) {
  const height = SIZES[size];
  const width = Math.round(height * RATIO * 100) / 100;
  return (
    <span className={cn("inline-flex items-center gap-3", size === "md" && "gap-2.5", className)}>
      <span className={cn("relative shrink-0", animated && "animate-logo-enter")} style={{ width, height }}>
        <Image src="/logo-utmarket.svg" alt="" fill unoptimized loading="eager" className="dark:hidden" />
        <Image src="/logo-utmarket-dark.svg" alt="" fill unoptimized loading="eager" className="hidden dark:block" />
      </span>
      {withWordmark ? (
        <span className={cn(size === "sm" ? "type-title-3" : "type-title-2", "whitespace-nowrap text-ut-text")}>
          UTMarket
        </span>
      ) : (
        <span className="sr-only">UTMarket</span>
      )}
    </span>
  );
}
