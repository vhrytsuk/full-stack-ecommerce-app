import { rotateSession } from "./session/rotateSession";

/**
 * Thin backward-compatible alias over `rotateSession`. Reads the stored refresh
 * token, calls the backend, and persists the rotated tokens.
 *
 * Writes cookies, so it must only run in a Server Action, Route Handler, or
 * middleware. Returns the new access token, or `null` when refresh fails.
 */
export async function refreshAccessToken(): Promise<string | null> {
  return rotateSession();
}
