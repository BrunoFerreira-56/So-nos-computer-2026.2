/**
 * Schemas de anúncio (US06, US07, US10 · RF06, RF07, RF10).
 * As mensagens de erro seguem o Figma D08b ("Informe um título para o anúncio." etc.).
 */
import { z } from "zod";
import { CATEGORIES, CONDITIONS, MAX_LISTING_PHOTOS } from "@/lib/constants";
import type { CategoryId, ConditionId } from "@/types/domain";
import { campusSchema } from "@/features/auth/schemas";

const categoryIds = CATEGORIES.map((c) => c.id) as [CategoryId, ...CategoryId[]];
const conditionIds = CONDITIONS.map((c) => c.id) as [ConditionId, ...ConditionId[]];

export const listingSchema = z.object({
  title: z.string().trim().min(3, "Informe um título para o anúncio.").max(80, "Use no máximo 80 caracteres."),
  priceCents: z
    .number({ error: "Informe o preço do anúncio." })
    .int()
    .positive("Informe o preço do anúncio.")
    .max(10_000_000, "Confira o preço informado."),
  category: z.enum(categoryIds, { error: "Escolha uma categoria." }),
  condition: z.enum(conditionIds, { error: "Informe a condição do produto." }),
  campus: z.enum(campusSchema.options, { error: "Escolha o campus onde o produto será entregue." }),
  description: z.string().trim().max(2000, "Use no máximo 2000 caracteres."),
  images: z.array(z.string()).max(MAX_LISTING_PHOTOS, `Adicione no máximo ${MAX_LISTING_PHOTOS} fotos.`),
});

/** Valores enquanto o formulário é preenchido (selects começam vazios). */
export type ListingFormValues = z.input<typeof listingSchema>;
export type ListingInput = z.output<typeof listingSchema>;

/** Rótulos usados no alerta-resumo "Faltam N campos obrigatórios: …" (D08b). */
export const REQUIRED_FIELD_LABELS: Record<keyof Omit<ListingInput, "description" | "images">, string> = {
  title: "Título",
  priceCents: "Preço",
  category: "Categoria",
  condition: "Condição",
  campus: "Campus",
};

export const statusSchema = z.object({
  status: z.enum(["disponivel", "vendido", "inativo"]),
});
