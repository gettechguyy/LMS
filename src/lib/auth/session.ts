import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { createSupabaseAdmin } from "@/lib/supabase/client";
import type { SessionUser } from "@/types";
import { AppError } from "@/lib/errors";

const ACCESS_TOKEN_COOKIE = "lms_access_token";
const REFRESH_TOKEN_COOKIE = "lms_refresh_token";

export { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE };

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) return null;

  try {
    const payload = await verifyAccessToken(accessToken);
    const supabase = createSupabaseAdmin();

    const { data: user, error } = await supabase
      .from("LMS_users")
      .select("id, email, first_name, last_name, avatar, role, is_email_verified, onboarding_completed, status")
      .eq("id", payload.sub)
      .single();

    if (error || !user || user.status !== "active") return null;

    const { data: orgMembership } = await supabase
      .from("LMS_user_organizations")
      .select("organization_id, is_default")
      .eq("user_id", user.id)
      .eq("is_default", true)
      .single();

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      avatar: user.avatar,
      role: user.role,
      organizationId: orgMembership?.organization_id ?? payload.organizationId ?? null,
      isEmailVerified: user.is_email_verified,
      onboardingCompleted: user.onboarding_completed,
    };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  return session;
}

export async function requireRole(...roles: SessionUser["role"][]): Promise<SessionUser> {
  const session = await requireSession();
  if (!roles.includes(session.role)) {
    throw new AppError("Forbidden", 403, "FORBIDDEN");
  }
  return session;
}

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  rememberMe = false
) {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

export function hasPermission(
  userRole: SessionUser["role"],
  requiredRoles: SessionUser["role"][]
): boolean {
  return requiredRoles.includes(userRole);
}

export const ROLE_HIERARCHY: Record<SessionUser["role"], number> = {
  student: 1,
  mentor: 2,
  instructor: 3,
  admin: 4,
};

export function hasMinimumRole(
  userRole: SessionUser["role"],
  minimumRole: SessionUser["role"]
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
}
