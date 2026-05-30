import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken } from "@/lib/auth/jwt";
import { UserRepository } from "@/lib/repositories";
import { setAuthCookies, REFRESH_TOKEN_COOKIE } from "@/lib/auth/session";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { handleError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(`refresh:${ip}`, { maxRequests: 10, windowMs: 60000 });

  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const payload = await verifyRefreshToken(refreshToken);
    const repo = new UserRepository();
    const { accessToken, refreshToken: newRefreshToken } = await repo.createSession(payload.sub);

    await setAuthCookies(accessToken, newRefreshToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    const appError = handleError(error);
    return NextResponse.json({ error: appError.message }, { status: appError.statusCode });
  }
}
