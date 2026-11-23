/** POST /api/users/:id/reviews — avaliar outro usuário (US14 · RF14). */
import { reviewSchema } from "@/features/reviews/schemas";
import { getDb, newId } from "@/mocks/db";
import { fail, ok, parseBody, withUser } from "@/mocks/http";
import { findUser, toReview } from "@/mocks/serializers";

type Ctx = { params: Promise<{ id: string }> };

export const POST = withUser(async (user, request: Request, { params }: Ctx) => {
  const { id } = await params;
  if (id === user.id) return fail(400, "Você não pode avaliar a si mesmo.");
  if (!findUser(id)) return fail(404, "Usuário não encontrado.");

  const { data, error } = await parseBody(request, reviewSchema);
  if (error) return error;

  const review = {
    id: newId("r"),
    targetUserId: id,
    authorId: user.id,
    rating: data.rating,
    tags: data.tags,
    comment: data.comment,
    createdAt: new Date().toISOString(),
  };
  getDb().reviews.push(review);
  return ok(toReview(review), { status: 201 });
});
