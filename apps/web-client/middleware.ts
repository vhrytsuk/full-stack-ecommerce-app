import { decodeJwt } from "jose";
import { NextResponse, type NextRequest } from "next/server";

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/shared/api/authenticationCookieNames";

const API_BASE_URL =
  process.env.API_BASE_URL_INTERNAL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
const ACCESS_TOKEN_MAX_AGE_SECONDS = 15 * 60;

/** Refresh ~10s early to avoid using a token that expires mid-render. */
const EXPIRY_SKEW_MS = 10_000;

const protectedRoutes = ["/contact"];
const publicRoutes = ["/sign-in"];

type RefreshPayload = {
  accessToken: string;
  refreshToken: string;
  session: {
    expiresAt: string;
  };
};

const tokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;

function isRouteMatch(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Treats the access token as stale when it is missing, malformed, or expired
 * with an early-refresh skew. Cookie presence alone is not enough because the
 * JWT inside may already be expired.
 */
function isAccessTokenStale(token: string | undefined): boolean {
  if (!token) return true;

  try {
    const { exp } = decodeJwt(token);
    if (!exp) return true;
    return exp * 1000 <= Date.now() + EXPIRY_SKEW_MS;
  } catch {
    return true;
  }
}

function redirectToSignIn(request: NextRequest): NextResponse {
  const signInUrl = new URL("/sign-in", request.url);
  signInUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );

  return NextResponse.redirect(signInUrl);
}

function createNextResponse(request: NextRequest): NextResponse {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Cookie", request.cookies.toString());

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

function setAuthenticationCookies(
  response: NextResponse,
  payload: RefreshPayload
): void {
  response.cookies.set(ACCESS_TOKEN_COOKIE, payload.accessToken, {
    ...tokenCookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, payload.refreshToken, {
    ...tokenCookieOptions,
    expires: new Date(payload.session.expiresAt),
  });
}

function setRequestAuthenticationCookies(
  request: NextRequest,
  payload: RefreshPayload
): void {
  request.cookies.set(ACCESS_TOKEN_COOKIE, payload.accessToken);
  request.cookies.set(REFRESH_TOKEN_COOKIE, payload.refreshToken);
}

function clearAuthenticationCookies(response: NextResponse): void {
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
}

function isRefreshPayload(data: unknown): data is RefreshPayload {
  if (!data || typeof data !== "object") {
    return false;
  }

  const payload = data as {
    accessToken?: unknown;
    refreshToken?: unknown;
    session?: { expiresAt?: unknown };
  };

  return (
    typeof payload.accessToken === "string" &&
    payload.accessToken.length > 0 &&
    typeof payload.refreshToken === "string" &&
    payload.refreshToken.length > 0 &&
    typeof payload.session?.expiresAt === "string" &&
    !Number.isNaN(new Date(payload.session.expiresAt).getTime())
  );
}

async function refreshAuthentication(
  refreshToken: string | undefined
): Promise<RefreshPayload | null> {
  if (!refreshToken || !API_BASE_URL) {
    return null;
  }

  const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `${REFRESH_TOKEN_COOKIE}=${refreshToken}`,
    },
  });

  if (!refreshResponse.ok) {
    return null;
  }

  const data = (await refreshResponse.json().catch(() => null)) as unknown;
  return isRefreshPayload(data) ? data : null;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = isRouteMatch(pathname, protectedRoutes);
  const isPublicRoute = isRouteMatch(pathname, publicRoutes);
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  const isAccessStale = isAccessTokenStale(accessToken);

  if (isPublicRoute && !isAccessStale) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAccessStale && refreshToken) {
    const refreshPayload = await refreshAuthentication(refreshToken);

    if (refreshPayload) {
      setRequestAuthenticationCookies(request, refreshPayload);

      const response = isPublicRoute
        ? NextResponse.redirect(new URL("/", request.url))
        : createNextResponse(request);

      setAuthenticationCookies(response, refreshPayload);
      return response;
    }

    const response = isProtectedRoute
      ? redirectToSignIn(request)
      : createNextResponse(request);

    clearAuthenticationCookies(response);
    return response;
  }

  if (isProtectedRoute && isAccessStale) {
    return redirectToSignIn(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
