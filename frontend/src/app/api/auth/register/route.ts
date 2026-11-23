/** POST /api/auth/register — US01 · RF01, RNF01 (mock). */
import { registerSchema } from "@/features/auth/schemas";
import { getDb, newId, type DbUser } from "@/mocks/db";
import { delay, fail, ok, parseBody, setSessionCookie } from "@/mocks/http";
import { toUser } from "@/mocks/serializers";

export async function POST(request: Request) {
  await delay(500);
  const { data, error } = await parseBody(request, registerSchema);
  if (error) return error;

  const db = getDb();
  if (db.users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    return fail(409, "Já existe uma conta com este e-mail.", {
      code: "email_taken",
      fields: { email: "Já existe uma conta com este e-mail. Tente entrar." },
    });
  }

  const user: DbUser = {
    id: newId("u"),
    name: data.name,
    email: data.email.toLowerCase(),
    campus: data.campus,
    memberSince: new Date().getFullYear(),
    password: data.password,
    ratingSeed: { sum: 0, count: 0 },
  };
  db.users.push(user);
  return setSessionCookie(ok(toUser(user), { status: 201 }), user.id);
}
