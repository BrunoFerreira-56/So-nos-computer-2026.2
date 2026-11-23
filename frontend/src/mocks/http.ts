/**
 * Utilitários dos Route Handlers mock: respostas JSON, sessão via cookie e latência simulada.
 */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { ZodType } from "zod";
import { getDb, type DbUser } from "./db";

export const SESSION_COOKIE = "utm_session";

/** Latência artificial para os estados de carregamento (D03b) aparecerem. Bem abaixo dos 2 s do RNF02. */
export function delay(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function fail(status: number, message: string, extra?: { code?: string; fields?: Record<string, string> }) {
  return NextResponse.json({ message, ...extra }, { status });
}

export async function getSessionUser(): Promise<DbUser | null> {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (!id) return null;
  return getDb().users.find((u) => u.id === id) ?? null;
}

type Authed<Args extends unknown[]> = (user: DbUser, ...args: Args) => Promise<Response>;

/** Envolve um handler que exige usuário logado; responde 401 caso contrário. */
export function withUser<Args extends unknown[]>(handler: Authed<Args>) {
  return async (...args: Args): Promise<Response> => {
    await delay();
    const user = await getSessionUser();
    if (!user) return fail(401, "Sua sessão expirou. Entre novamente.", { code: "unauthenticated" });
    return handler(user, ...args);
  };
}

/** Lê e valida o corpo JSON com um schema Zod; devolve 422 com erros por campo. */
export async function parseBody<T>(request: Request, schema: ZodType<T>) {
  const raw: unknown = await request.json().catch(() => null);
  const result = schema.safeParse(raw);
  if (result.success) return { data: result.data, error: null } as const;
  const fields: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join(".") || "_";
    fields[key] ??= issue.message;
  }
  return {
    data: null,
    error: fail(422, "Alguns campos estão inválidos.", { code: "validation", fields }),
  } as const;
}

export function setSessionCookie(response: NextResponse, userId: string) {
  response.cookies.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
