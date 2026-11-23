import { Icon } from "@/components/ui/icon";
import { ProductImage } from "@/components/ui/product-image";
import { UserAvatar } from "@/components/ui/user-avatar";
import { campusName } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/format";
import type { CampusId } from "@/types/domain";

interface ListingPreviewProps {
  title: string;
  priceCents: number;
  campus: CampusId | "";
  description: string;
  image?: string;
  sellerName?: string;
}

/** Painel "Prévia" do formulário de anúncio (D08/D08c): atualiza enquanto o usuário digita. */
export function ListingPreview({ title, priceCents, campus, description, image, sellerName }: ListingPreviewProps) {
  const muted = "text-ut-text-muted";
  return (
    <div className="flex min-h-[640px] flex-1 overflow-hidden rounded-ut-lg border border-ut-border bg-ut-canvas">
      <div className="relative flex flex-[1.15] flex-col items-center justify-center gap-2 bg-ut-placeholder p-8 text-center">
        {image ? (
          <ProductImage src={image} alt="" sizes="40vw" eager />
        ) : (
          <>
            <Icon name="image" size={28} />
            <p className="type-title-2 text-ut-text-secondary">Prévia do seu anúncio</p>
            <p className="max-w-[300px] type-body text-ut-text-secondary">
              Ao criar seu anúncio você verá aqui como ele aparecerá para outros alunos.
            </p>
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className={cn("type-title-2 break-words", title ? "text-ut-text" : muted)}>{title || "Título"}</p>
        <p className={cn("type-price", priceCents ? "text-ut-text" : muted)}>
          {priceCents ? formatPrice(priceCents) : "Preço"}
        </p>
        <p className="type-caption text-ut-text-secondary">
          Anunciado agora · {campus ? `Campus ${campusName(campus)}` : "Campus"}
        </p>
        <p className="mt-2 type-title-3 text-ut-text">Detalhes</p>
        <p
          className={cn(
            "line-clamp-6 type-body whitespace-pre-line",
            description ? "text-ut-text" : "text-ut-text-secondary",
          )}
        >
          {description || "A descrição aparecerá aqui."}
        </p>
        <p className="mt-2 type-title-3 text-ut-text">Informações do vendedor</p>
        <div className="flex items-center gap-3">
          <UserAvatar name={sellerName} />
          <span className="type-body text-ut-text">{sellerName}</span>
        </div>
      </div>
    </div>
  );
}
