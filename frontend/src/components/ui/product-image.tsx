import Image from "next/image";
import { cn } from "@/lib/format";
import { Icon } from "./icon";

interface ProductImageProps {
  src?: string;
  alt: string;
  /** Tamanho de exibição para o otimizador do next/image. */
  sizes?: string;
  /** Imagem acima da dobra (candidata a LCP): carrega já, com prioridade alta. */
  eager?: boolean;
  /** Texto do placeholder quando não há foto ("Foto do produto" no Figma). */
  placeholder?: string;
  className?: string;
}

/**
 * Foto do anúncio preenchendo o contêiner pai (que define tamanho e cantos).
 * Sem foto, mostra o Placeholder/Imagem do Figma (25:153).
 * Aceita URLs locais (/mock/…) e data URLs de fotos recém-enviadas.
 */
export function ProductImage({
  src,
  alt,
  sizes = "(max-width: 768px) 50vw, 250px",
  eager,
  placeholder = "Foto do produto",
  className,
}: ProductImageProps) {
  if (!src) {
    return (
      <div className={cn("flex size-full flex-col items-center justify-center gap-1 bg-ut-placeholder", className)}>
        <Icon name="image" />
        {placeholder ? <span className="type-caption text-ut-text-secondary">{placeholder}</span> : null}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      unoptimized={src.startsWith("data:")}
      className={cn("object-cover", className)}
    />
  );
}
