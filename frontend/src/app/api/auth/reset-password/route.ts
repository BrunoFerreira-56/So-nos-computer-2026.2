/**
 * POST /api/auth/reset-password — US12 · RF12 (mock).
 * Num backend real o link do e-mail traria um token; aqui o e-mail vai na URL da tela D02c.
 */
import { resetPasswordSchema } from "@/features/auth/schemas";
import { getDb } from "@/mocks/db";
import { delay, fail, ok, parseBody, setSessionCookie } from "@/mocks/http";
import { toUser } from "@/mocks/serializers";

export async function POST(request: Request) {
  await delay(500);
  const { data, error } = await parseBody(request, resetPasswordSchema);
  if (error) return error;

  const user = getDb().users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
  if (!user) {
    return fail(400, "Este link de recuperação não é mais válido. Peça um novo.", { code: "invalid_link" });
  }
  user.password = data.password;
  return setSessionCookie(ok(toUser(user)), user.id);
}
