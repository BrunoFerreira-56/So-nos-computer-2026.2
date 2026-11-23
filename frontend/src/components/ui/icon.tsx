import type { CSSProperties } from "react";
import { cn } from "@/lib/format";

/** Os 33 ícones da biblioteca do Figma ("Grupo / Ícones (20px)", nó 25:5), em public/icons. */
export type IconName =
  | "alert"
  | "bell"
  | "chat"
  | "check"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "edit"
  | "filter"
  | "flag"
  | "grid"
  | "heart"
  | "heart-filled"
  | "home"
  | "image"
  | "lock"
  | "logout"
  | "mail"
  | "map-pin"
  | "menu"
  | "moon"
  | "more"
  | "plus"
  | "search"
  | "send"
  | "star"
  | "star-filled"
  | "sun"
  | "tag"
  | "trash"
  | "user"
  | "wifi-off"
  | "x";

const TONE = {
  /** color/icon/default */
  default: "text-ut-icon",
  /** color/icon/accent (coração favoritado) */
  accent: "text-ut-icon-accent",
  /** color/rating (estrelas) */
  rating: "text-ut-rating",
  /** herda a cor do texto ao redor (ex.: dentro de botões) */
  inherit: "",
} as const;

interface IconProps {
  name: IconName;
  /** Tamanho em px (o Figma usa 20 na maioria dos lugares, 14–16 em legendas e 32 no estado vazio). */
  size?: number;
  tone?: keyof typeof TONE;
  /** Texto para leitores de tela. Sem ele, o ícone é decorativo. */
  label?: string;
  className?: string;
}

/**
 * Ícone do Figma renderizado como máscara CSS: o SVG original fica intacto e a cor
 * vem de `currentColor`, o que permite trocar a cor no modo escuro.
 */
export function Icon({ name, size = 20, tone = "default", label, className }: IconProps) {
  const style: CSSProperties = {
    width: size,
    height: size,
    maskImage: `url(/icons/${name}.svg)`,
    WebkitMaskImage: `url(/icons/${name}.svg)`,
  };
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("icon-mask", TONE[tone], className)}
      style={style}
    />
  );
}
