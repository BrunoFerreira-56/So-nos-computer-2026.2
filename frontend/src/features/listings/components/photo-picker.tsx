"use client";

import { useRef, useState, type DragEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { notifyError } from "@/components/ui/notify";
import { ProductImage } from "@/components/ui/product-image";
import { MAX_LISTING_PHOTOS } from "@/lib/constants";
import { cn } from "@/lib/format";
import { resizeImage } from "@/lib/image";

interface PhotoPickerProps {
  value: string[];
  onChange: (images: string[]) => void;
}

/**
 * Fotos do anúncio (D08 vazio, D08c com miniaturas): clique ou arraste e solte, até 10 fotos.
 */
export function PhotoPicker({ value, onChange }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const remaining = MAX_LISTING_PHOTOS - value.length;

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const images = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (images.length > remaining) notifyError(`Você pode adicionar no máximo ${MAX_LISTING_PHOTOS} fotos.`);
    setProcessing(true);
    try {
      const resized = await Promise.all(images.slice(0, remaining).map((file) => resizeImage(file)));
      onChange([...value, ...resized]);
    } catch {
      notifyError("Não foi possível carregar uma das fotos.");
    } finally {
      setProcessing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    void addFiles(event.dataTransfer.files);
  }

  const dropProps = {
    onDragOver: (event: DragEvent) => {
      event.preventDefault();
      setDragging(true);
    },
    onDragLeave: () => setDragging(false),
    onDrop,
  };

  const label =
    value.length === 0
      ? `Fotos · 0/${MAX_LISTING_PHOTOS} — adicione até ${MAX_LISTING_PHOTOS} fotos`
      : `Fotos · ${value.length}/${MAX_LISTING_PHOTOS}`;

  return (
    <div className="flex flex-col gap-2">
      <p className="type-body-strong text-ut-text" id="photos-label">
        {label}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        aria-labelledby="photos-label"
        onChange={(event) => void addFiles(event.target.files)}
      />

      {value.length === 0 ? (
        <button
          type="button"
          {...dropProps}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex h-[150px] w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-ut-md border border-dashed border-ut-border-strong bg-ut-subtle transition-colors",
            "focus-visible:outline-2 focus-visible:outline-ut-focus",
            dragging && "border-ut-focus bg-ut-info-subtle",
          )}
        >
          <Icon name="image" size={28} />
          <span className="mt-1 type-body-strong text-ut-text">
            {processing ? "Carregando fotos…" : "Adicionar fotos"}
          </span>
          <span className="type-caption text-ut-text-secondary">ou arraste e solte aqui</span>
        </button>
      ) : (
        <ul className="grid grid-cols-4 gap-2" {...dropProps}>
          {value.map((src, index) => (
            <li
              key={`${index}-${src.slice(-24)}`}
              className="group relative aspect-square overflow-hidden rounded-ut-md bg-ut-placeholder"
            >
              <ProductImage src={src} alt={`Foto ${index + 1}`} sizes="96px" placeholder="" />
              <button
                type="button"
                aria-label={`Remover foto ${index + 1}`}
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="absolute top-1 right-1 flex size-7 cursor-pointer items-center justify-center rounded-full border border-ut-border bg-ut-canvas opacity-90 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-ut-focus"
              >
                <Icon name="x" size={16} />
              </button>
            </li>
          ))}
          {remaining > 0 ? (
            <li>
              <button
                type="button"
                aria-label="Adicionar mais fotos"
                onClick={() => inputRef.current?.click()}
                className={cn(
                  "flex aspect-square w-full cursor-pointer items-center justify-center rounded-ut-md border border-dashed border-ut-border-strong transition-colors hover:bg-ut-subtle",
                  "focus-visible:outline-2 focus-visible:outline-ut-focus",
                  dragging && "border-ut-focus bg-ut-info-subtle",
                )}
              >
                <Icon name="plus" />
              </button>
            </li>
          ) : null}
        </ul>
      )}
    </div>
  );
}
