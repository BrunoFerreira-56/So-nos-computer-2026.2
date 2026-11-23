"use client";

import { useState } from "react";
import { cn } from "@/lib/format";
import { Icon } from "./icon";

interface RatingStarsProps {
  value: number;
  size?: number;
  /** Texto ao lado, ex.: "4,0 (12 avaliações)". */
  caption?: string;
  className?: string;
}

/** Avaliação (estrelas) somente leitura (26:129). */
export function RatingStars({ value, size = 20, caption, className }: RatingStarsProps) {
  const rounded = Math.round(value);
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="flex items-center gap-1" role="img" aria-label={`Nota ${value.toFixed(1)} de 5`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name={star <= rounded ? "star-filled" : "star"}
            tone={star <= rounded ? "rating" : "default"}
            size={size}
          />
        ))}
      </span>
      {caption ? <span className="type-caption text-ut-text-secondary">{caption}</span> : null}
    </div>
  );
}

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
}

/** Seletor de estrelas do modal "Avaliar" (D10b). Acessível como grupo de rádio. */
export function RatingInput({ value, onChange, size = 36 }: RatingInputProps) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div
      role="radiogroup"
      aria-label="Nota de 1 a 5"
      className="flex items-center gap-3"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} ${star === 1 ? "estrela" : "estrelas"}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") onChange(Math.min(5, (value || 0) + 1));
            if (event.key === "ArrowLeft") onChange(Math.max(1, (value || 2) - 1));
          }}
          className="cursor-pointer rounded-ut-sm transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-ut-focus"
        >
          <Icon name={star <= shown ? "star-filled" : "star"} tone={star <= shown ? "rating" : "default"} size={size} />
        </button>
      ))}
    </div>
  );
}
