/** Schema de denúncia de anúncio ou perfil (US13 · RF13). */
import { z } from "zod";
import { REPORT_REASONS } from "@/lib/constants";
import type { ReportReason } from "@/types/domain";

const reasonIds = REPORT_REASONS.map((r) => r.id) as [ReportReason, ...ReportReason[]];

export const reportSchema = z.object({
  targetType: z.enum(["listing", "user"]),
  targetId: z.string().min(1),
  reason: z.enum(reasonIds, { error: "Escolha o motivo da denúncia." }),
  details: z.string().trim().max(1000, "Use no máximo 1000 caracteres."),
});
export type ReportFormValues = z.input<typeof reportSchema>;
export type ReportInput = z.output<typeof reportSchema>;
