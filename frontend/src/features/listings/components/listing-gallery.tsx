"use client";

import { useState } from "react";
import { ProductImage } from "@/components/ui/product-image";
import { cn } from "@/lib/format";

/** Galeria da tela de detalhes (D06): foto principal + miniaturas clicáveis. */
export function ListingGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[390/280] w-full overflow-hidden bg-ut-placeholder md:aspect-[914/763] md:rounded-ut-md">
        <ProductImage src={current} alt={title} eager sizes="(min-width: 768px) 65vw, 100vw" placeholder="Sem fotos" />
      </div>

      {images.length > 1 ? (
        <div role="tablist" aria-label="Fotos do anúncio" className="hidden flex-wrap justify-center gap-2 md:flex">
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Foto ${index + 1} de ${images.length}`}
              onClick={() => setActive(index)}
              className={cn(
                "relative size-[72px] cursor-pointer overflow-hidden rounded-ut-sm border-2 transition-opacity",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ut-focus",
                index === active ? "border-ut-border-strong" : "border-transparent opacity-80 hover:opacity-100",
              )}
            >
              <ProductImage src={src} alt="" sizes="72px" placeholder="" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
