"use server";

import { redirect } from "next/navigation";

import { clearAuthenticationTokens, getRefreshToken } from "@/shared/api";
import { REFRESH_TOKEN_COOKIE } from "@/shared/api/constants";
import { clientConfig } from "@/shared/config";

/**
 * Logs out the current BFF session.
 *
 * The backend revokes sessions by reading the refresh token from a cookie, so
 * the BFF forwards its HttpOnly refresh token explicitly. Local cookies are
 * cleared even if the backend request fails or the refresh token is missing.
 */
export async function logOut(): Promise<void> {
  const refreshToken = await getRefreshToken();

  try {
    if (refreshToken) {
      await fetch(`${clientConfig.serverApiBaseUrl}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${REFRESH_TOKEN_COOKIE}=${refreshToken}`,
        },
      });
    }
  } finally {
    await clearAuthenticationTokens();
  }
}

export async function logOutAction(): Promise<void> {
  await logOut();
  redirect("/sign-in");
}
