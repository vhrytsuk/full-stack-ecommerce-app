import { cookies } from "next/headers";

export {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "./authenticationCookieNames";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "./authenticationCookieNames";
const ACCESS_TOKEN_MAX_AGE_SECONDS = 15 * 60;

type AuthenticationTokens = {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt?: string;
};

const secure = process.env.NODE_ENV === "production";
const tokenCookieOptions = {
  httpOnly: true,
  secure,
  sameSite: "lax",
  path: "/",
} as const;

/**
 * Server-side token store.
 *
 * The BFF owns browser cookies. Tokens returned by the backend are persisted
 * as HttpOnly cookies so browser JavaScript cannot read them.
 */
export async function saveAuthenticationTokens({
  accessToken,
  refreshToken,
  refreshTokenExpiresAt,
}: AuthenticationTokens): Promise<void> {
  const cookieStore = await cookies();
  const refreshExpires = refreshTokenExpiresAt
    ? new Date(refreshTokenExpiresAt)
    : undefined;

  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...tokenCookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...tokenCookieOptions,
    ...(refreshExpires ? { expires: refreshExpires } : {}),
  });
}

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
}

export async function clearAuthenticationTokens(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}
