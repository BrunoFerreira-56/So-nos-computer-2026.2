import { STATUS_LABEL } from "@/lib/constants";
import { cn } from "@/lib/format";
import type { ListingStatus } from "@/types/domain";

const STYLES: Record<ListingStatus, string> = {
  disponivel: "bg-ut-success-subtle text-ut-success font-medium",
  vendido: "bg-ut-inverse text-ut-text-inverse",
  inativo: "border border-dashed border-ut-border-strong bg-ut-subtle text-ut-text",
};

/** Badge de status (25:166): Disponível, Vendido, Inativo (US10). */
export function StatusBadge({ status, className }: { status: ListingStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2 py-1 type-caption whitespace-nowrap",
        STYLES[status],
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
