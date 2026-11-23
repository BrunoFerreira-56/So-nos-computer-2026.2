/**
 * Proxy (antigo "middleware" — renomeado no Next.js 16).
 *
 * Checagem otimista de sessão: sem o cookie `utm_session`, as telas do app levam ao login;
 * com ele, as telas de login/cadastro levam ao hub. A validação real é feita pela API.
 */
import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "utm_session";
const AUTH_ROUTES = ["/login", "/cadastro", "/recuperar-senha", "/nova-senha"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (!hasSession && !isAuthRoute) {
    const url = new URL("/login", request.url);
    if (pathname !== "/") url.searchParams.set("voltar", pathname + search);
    return NextResponse.redirect(url);
  }
  if (hasSession && (pathname === "/login" || pathname === "/cadastro")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Ignora a API mock, arquivos estáticos e internos do Next.
  matcher: ["/((?!api|_next/static|_next/image|icons|mock|favicon.ico|.*\\.(?:svg|png|jpg|webp)$).*)"],
};
