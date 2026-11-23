/** POST /api/auth/login — US01 · RF01, RNF01 (mock). */
import { loginSchema } from "@/features/auth/schemas";
import { getDb } from "@/mocks/db";
import { delay, fail, ok, parseBody, setSessionCookie } from "@/mocks/http";
import { toUser } from "@/mocks/serializers";

export async function POST(request: Request) {
  await delay(500);
  const { data, error } = await parseBody(request, loginSchema);
  if (error) return error;

  const user = getDb().users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
  if (!user || user.password !== data.password) {
    return fail(401, "E-mail ou senha incorretos. Verifique os dados e tente novamente.", {
      code: "invalid_credentials",
    });
  }
  return setSessionCookie(ok(toUser(user)), user.id);
}
