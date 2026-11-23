/**
 * POST /api/auth/forgot-password — US12 · RF12 (mock).
 * Sempre responde 200, exista ou não a conta, para não revelar quais e-mails estão cadastrados.
 */
import { forgotPasswordSchema } from "@/features/auth/schemas";
import { delay, ok, parseBody } from "@/mocks/http";

export async function POST(request: Request) {
  await delay(600);
  const { data, error } = await parseBody(request, forgotPasswordSchema);
  if (error) return error;
  return ok({ sentTo: data.email, expiresInMinutes: 30 });
}
