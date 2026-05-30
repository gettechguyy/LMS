import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload, UserRole } from "@/types";

const accessSecret = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || "dev-access-secret-min-32-characters-long"
);
const refreshSecret = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "dev-refresh-secret-min-32-characters-long"
);

const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "15m";
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || "7d";

function parseExpiry(expiry: string): string {
  return expiry;
}

export async function signAccessToken(payload: {
  sub: string;
  email: string;
  role: UserRole;
  organizationId?: string;
}): Promise<string> {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
    organizationId: payload.organizationId,
    type: "access",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(parseExpiry(ACCESS_EXPIRY))
    .sign(accessSecret);
}

export async function signRefreshToken(payload: {
  sub: string;
  email: string;
  role: UserRole;
  organizationId?: string;
}): Promise<string> {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
    organizationId: payload.organizationId,
    type: "refresh",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(parseExpiry(REFRESH_EXPIRY))
    .sign(refreshSecret);
}

export async function verifyAccessToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, accessSecret);
  return {
    sub: payload.sub as string,
    email: payload.email as string,
    role: payload.role as UserRole,
    organizationId: payload.organizationId as string | undefined,
    type: "access",
  };
}

export async function verifyRefreshToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, refreshSecret);
  return {
    sub: payload.sub as string,
    email: payload.email as string,
    role: payload.role as UserRole,
    organizationId: payload.organizationId as string | undefined,
    type: "refresh",
  };
}

export function getRefreshExpiryDays(): number {
  const match = REFRESH_EXPIRY.match(/^(\d+)d$/);
  return match ? parseInt(match[1], 10) : 7;
}

export function getAccessExpiryMs(): number {
  const match = ACCESS_EXPIRY.match(/^(\d+)m$/);
  return match ? parseInt(match[1], 10) * 60 * 1000 : 15 * 60 * 1000;
}
