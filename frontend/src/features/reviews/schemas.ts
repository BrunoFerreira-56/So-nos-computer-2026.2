/** Schema de avaliação de usuário (US14 · RF14). */
import { z } from "zod";
import { REVIEW_TAGS } from "@/lib/constants";
import type { ReviewTag } from "@/types/domain";

const tagIds = REVIEW_TAGS.map((t) => t.id) as [ReviewTag, ...ReviewTag[]];

export const reviewSchema = z.object({
  rating: z
    .number({ error: "Escolha de 1 a 5 estrelas." })
    .int()
    .min(1, "Escolha de 1 a 5 estrelas.")
    .max(5, "Escolha de 1 a 5 estrelas."),
  tags: z.array(z.enum(tagIds)),
  comment: z.string().trim().max(500, "Use no máximo 500 caracteres."),
  listingId: z.string().optional(),
});
export type ReviewFormValues = z.input<typeof reviewSchema>;
export type ReviewInput = z.output<typeof reviewSchema>;
