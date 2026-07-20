import type { RefreshResponse } from "@repo/api-contracts";
import { refreshResponseSchema } from "@repo/api-contracts";

import { clientConfig } from "@/shared/config";

import { ApiError } from "../../utils/ApiError";
import { REFRESH_TOKEN_COOKIE } from "../authenticationTokens";
/**
 * Pure refresh call. Sends the given refresh token to the backend
 * `/auth/refresh` endpoint and returns the rotated tokens.
 *
 * This function NEVER reads or writes cookies, so it is safe to call from any
 * server context — including during Server Component render, where cookie
 * mutation is forbidden.
 *
 * Returns the validated `RefreshResponse`, or `null` when the refresh token is
 * missing/invalid/expired.
 */
export async function refreshTokens(
  refreshToken: string | undefined
): Promise<RefreshResponse | null> {
  if (!refreshToken) return null;

  const response = await fetch(
    `${clientConfig.serverApiBaseUrl}/auth/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${REFRESH_TOKEN_COOKIE}=${refreshToken}`,
      },
    }
  );

  if (!response.ok) {
    // Refresh token is invalid/expired.
    return null;
  }

  const data = (await response.json().catch(() => null)) as unknown;
  const parsed = refreshResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw new ApiError("Malformed refresh response", { status: 502 });
  }

  return parsed.data;
}
