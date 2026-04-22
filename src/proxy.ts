import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Determine current locale from pathname or default
  const segments = pathname.split("/");
  const locale = routing.locales.includes(segments[1] as any)
    ? segments[1]
    : routing.defaultLocale;

  const isLoginPage = pathname.includes("/login");
  const isRegisterPage = pathname.includes("/register");
  const isAuthPage = isLoginPage || isRegisterPage;

  // 1. If NOT logged in and trying to access a protected page
  if (!token && !isAuthPage) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If logged in and trying to access Login/Register
  if (token && isAuthPage) {
    const homeUrl = new URL(`/${locale}`, request.url);
    return NextResponse.redirect(homeUrl);
  }

  // 3. Handle internationalization
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
