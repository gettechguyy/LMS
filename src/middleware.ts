import { NextResponse, type NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/onboarding",
  "/courses",
  "/live-classes",
  "/assignments",
  "/projects",
  "/career",
  "/community",
  "/achievements",
  "/messages",
  "/resources",
  "/settings",
  "/admin",
  "/instructor",
  "/mentor",
  "/ai",
];

const ROLE_ROUTES: Record<string, string[]> = {
  "/admin": ["admin"],
  "/instructor": ["instructor", "admin"],
  "/mentor": ["mentor", "admin"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("lms_access_token")?.value;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  let isAuthenticated = false;
  let userRole: string | null = null;

  if (accessToken) {
    try {
      const payload = await verifyAccessToken(accessToken);
      isAuthenticated = true;
      userRole = payload.role;
    } catch {
      isAuthenticated = false;
    }
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && pathname.startsWith("/onboarding")) {
    return NextResponse.next();
  }

  if (isAuthenticated && isProtected && !pathname.startsWith("/onboarding")) {
    for (const [routePrefix, allowedRoles] of Object.entries(ROLE_ROUTES)) {
      if (pathname.startsWith(routePrefix) && userRole && !allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
