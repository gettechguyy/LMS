import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  getSession,
} from "@/lib/auth/session";
import { UserRepository, logAudit } from "@/lib/repositories";

async function handleLogout(request: NextRequest) {
  try {
    const session = await getSession();
    if (session) {
      const repo = new UserRepository();
      await repo.revokeAllSessions(session.id);
      await logAudit(session.id, "logout", "sessions");
    }
  } catch {
    // Still clear cookies and redirect even if session cleanup fails.
  }

  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
  return response;
}

export async function GET(request: NextRequest) {
  return handleLogout(request);
}

export async function POST(request: NextRequest) {
  return handleLogout(request);
}
