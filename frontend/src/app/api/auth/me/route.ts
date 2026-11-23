/** GET/PATCH /api/auth/me — usuário logado e troca de campus (menu lateral "Seu campus"). */
import { updateCampusSchema } from "@/features/auth/schemas";
import { ok, parseBody, withUser } from "@/mocks/http";
import { toUser } from "@/mocks/serializers";

export const GET = withUser(async (user) => ok(toUser(user)));

export const PATCH = withUser(async (user, request: Request) => {
  const { data, error } = await parseBody(request, updateCampusSchema);
  if (error) return error;
  user.campus = data.campus;
  return ok(toUser(user));
});
