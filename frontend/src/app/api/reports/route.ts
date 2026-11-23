/** POST /api/reports — denunciar anúncio ou perfil (US13 · RF13). */
import { reportSchema } from "@/features/reports/schemas";
import { getDb, newId } from "@/mocks/db";
import { ok, parseBody, withUser } from "@/mocks/http";
import type { Report } from "@/types/domain";

export const POST = withUser(async (_user, request: Request) => {
  const { data, error } = await parseBody(request, reportSchema);
  if (error) return error;

  const report: Report = { id: newId("rep"), ...data, createdAt: new Date().toISOString() };
  getDb().reports.push(report);
  return ok({ id: report.id }, { status: 201 });
});
