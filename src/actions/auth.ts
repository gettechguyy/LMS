"use server";

import { headers } from "next/headers";
import { UserRepository, logAudit } from "@/lib/repositories";
import { setAuthCookies, clearAuthCookies, requireSession } from "@/lib/auth/session";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type SignupInput,
  type LoginInput,
} from "@/lib/validators/auth";
import { handleError } from "@/lib/errors";
import type { ApiResponse, SessionUser } from "@/types";

async function getRequestMeta() {
  const headersList = await headers();
  return {
    userAgent: headersList.get("user-agent") ?? undefined,
    ip: headersList.get("x-forwarded-for")?.split(",")[0] ?? undefined,
  };
}

export async function signupAction(input: SignupInput): Promise<ApiResponse<{ user: SessionUser }>> {
  try {
    const validated = signupSchema.parse(input);
    const repo = new UserRepository();
    const { user, verificationToken } = await repo.create(validated);

    const { accessToken, refreshToken, user: sessionUser } = await repo.createSession(user.id);

    await setAuthCookies(accessToken, refreshToken);
    await logAudit(user.id, "signup", "users", user.id);

    // In production, send verification email with verificationToken
    console.log(`[DEV] Email verification token for ${user.email}: ${verificationToken}`);

    return { success: true, data: { user: sessionUser }, message: "Account created successfully" };
  } catch (error) {
    const appError = handleError(error);
    return { success: false, error: appError.message };
  }
}

export async function loginAction(input: LoginInput): Promise<ApiResponse<{ user: SessionUser }>> {
  try {
    const validated = loginSchema.parse(input);
    const repo = new UserRepository();
    const user = await repo.authenticate(validated.email, validated.password);
    const meta = await getRequestMeta();

    const { accessToken, refreshToken, user: sessionUser } = await repo.createSession(
      user.id,
      meta.userAgent,
      meta.ip
    );

    await setAuthCookies(accessToken, refreshToken, validated.rememberMe);
    await logAudit(user.id, "login", "sessions");

    return { success: true, data: { user: sessionUser } };
  } catch (error) {
    const appError = handleError(error);
    return { success: false, error: appError.message };
  }
}

export async function logoutAction(): Promise<ApiResponse> {
  try {
    const session = await requireSession().catch(() => null);
    if (session) {
      const repo = new UserRepository();
      await repo.revokeAllSessions(session.id);
      await logAudit(session.id, "logout", "sessions");
    }
    await clearAuthCookies();
    return { success: true, message: "Logged out successfully" };
  } catch {
    await clearAuthCookies();
    return { success: true };
  }
}

export async function forgotPasswordAction(email: string): Promise<ApiResponse> {
  try {
    const validated = forgotPasswordSchema.parse({ email });
    const repo = new UserRepository();
    const result = await repo.createPasswordResetToken(validated.email);

    if (result) {
      console.log(`[DEV] Password reset token for ${validated.email}: ${result.token}`);
    }

    return {
      success: true,
      message: "If an account exists, a reset link has been sent to your email",
    };
  } catch (error) {
    const appError = handleError(error);
    return { success: false, error: appError.message };
  }
}

export async function resetPasswordAction(
  token: string,
  password: string,
  confirmPassword: string
): Promise<ApiResponse> {
  try {
    resetPasswordSchema.parse({ token, password, confirmPassword });
    const repo = new UserRepository();
    await repo.resetPassword(token, password);
    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    const appError = handleError(error);
    return { success: false, error: appError.message };
  }
}

export async function verifyEmailAction(token: string): Promise<ApiResponse> {
  try {
    const repo = new UserRepository();
    await repo.verifyEmail(token);
    return { success: true, message: "Email verified successfully" };
  } catch (error) {
    const appError = handleError(error);
    return { success: false, error: appError.message };
  }
}

export async function getCurrentUserAction(): Promise<ApiResponse<{ user: SessionUser }>> {
  try {
    const session = await requireSession();
    return { success: true, data: { user: session } };
  } catch {
    return { success: false, error: "Not authenticated" };
  }
}
