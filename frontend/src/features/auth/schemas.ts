/**
 * Schemas de autenticação (US01, US12 · RF01, RF12, RNF01).
 * Usados pelos formulários (React Hook Form + zodResolver) e pela API mock.
 */
import { z } from "zod";
import { CAMPI, INSTITUTIONAL_DOMAINS, MIN_PASSWORD_LENGTH } from "@/lib/constants";
import type { CampusId } from "@/types/domain";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const NON_INSTITUTIONAL_EMAIL_MESSAGE =
  "Este e-mail não é aceito. Use seu e-mail institucional (@alunos.utfpr.edu.br ou @utfpr.edu.br).";

export function isInstitutionalEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@")[1] ?? "";
  return (INSTITUTIONAL_DOMAINS as readonly string[]).includes(domain);
}

/** E-mail institucional obrigatório (RNF01). */
export const institutionalEmail = z
  .string()
  .trim()
  .min(1, "Informe seu e-mail institucional.")
  .refine((value) => EMAIL_PATTERN.test(value), "Digite um e-mail válido.")
  .refine(isInstitutionalEmail, NON_INSTITUTIONAL_EMAIL_MESSAGE);

const campusIds = CAMPI.map((c) => c.id) as [CampusId, ...CampusId[]];

export const campusSchema = z.enum(campusIds, { error: "Selecione seu campus." });

const newPassword = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);

export const loginSchema = z.object({
  email: institutionalEmail,
  password: z.string().min(1, "Informe sua senha."),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Informe como você quer ser chamado."),
  email: institutionalEmail,
  campus: campusSchema,
  password: newPassword,
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: institutionalEmail,
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    email: institutionalEmail,
    password: newPassword,
    confirmPassword: z.string().min(1, "Confirme a nova senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem.",
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const updateCampusSchema = z.object({ campus: campusSchema });
