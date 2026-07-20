import {
  clearAuthenticationTokens,
  getRefreshToken,
  saveAuthenticationTokens,
} from "../authenticationTokens";
import { refreshTokens } from "./refreshTokens";

/**
 * Rotates the current session: reads the stored refresh token, mints new
 * tokens via the backend, and persists them as BFF cookies.
 *
 * Writes cookies, so it must only run where cookie mutation is allowed:
 * Server Actions, Route Handlers, or middleware. On failure it clears the
 * local session.
 *
 * Returns the new access token, or `null` when refresh is not possible.
 */
export async function rotateSession(): Promise<string | null> {
  const refreshToken = await getRefreshToken();

  const data = await refreshTokens(refreshToken);

  if (!data) {
    await clearAuthenticationTokens();
    return null;
  }

  await saveAuthenticationTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    refreshTokenExpiresAt: data.session.expiresAt,
  });

  return data.accessToken;
}
