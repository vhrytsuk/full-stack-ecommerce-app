import { clientConfig } from "@/shared/config";

import { ApiError } from "../utils/ApiError";
import {
  getAccessToken,
  getRefreshToken,
  saveAuthenticationTokens,
} from "./authenticationTokens";
import { refreshTokens } from "./session/refreshTokens";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Set to false to skip attaching the stored access token. */
  auth?: boolean;
  /**
   * Retry once after rotating tokens on a 401.
   *
   * This writes cookies and must only be enabled from Server Actions or Route
   * Handlers. Server Components should rely on middleware's proactive refresh.
   */
  refreshOnUnauthorized?: boolean;
};

/**
 * Server-side fetch wrapper for talking to the backend API from Server
 * Components and Server Actions.
 *
 * When an access token is stored it is attached as a `Bearer` header. Use
 * `parseJson` to read and normalize the JSON body.
 *
 * Refresh-and-retry is opt-in because refresh token rotation writes cookies,
 * which is only allowed in Server Actions and Route Handlers.
 */
export async function serverFetch(
  path: string,
  options: RequestOptions = {}
): Promise<Response> {
  const {
    body,
    headers,
    auth = true,
    refreshOnUnauthorized = false,

    ...rest
  } = options;

  const url = `${clientConfig.serverApiBaseUrl}${path}`;
  const serializedBody = body === undefined ? undefined : JSON.stringify(body);

  const send = (token: string | undefined) =>
    fetch(url, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: serializedBody,
    });

  const accessToken = auth ? await getAccessToken() : undefined;
  const response = await send(accessToken);

  // Access token likely expired: refresh once and replay the request.
  if (auth && refreshOnUnauthorized && response.status === 401) {
    const refreshToken = await getRefreshToken();
    const data = await refreshTokens(refreshToken);

    if (data) {
      await saveAuthenticationTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        refreshTokenExpiresAt: data.session.expiresAt,
      });

      return send(data.accessToken);
    }
  }

  return response;
}

/**
 * Reads a JSON response and throws a normalized `ApiError` on failure.
 */
export async function parseJson<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    const payload = (data ?? {}) as {
      message?: string;
      code?: string;
      errors?: Record<string, string[]>;
    };

    throw new ApiError(payload.message ?? "Request failed", {
      status: response.status,
      code: payload.code,
      fieldErrors: payload.errors,
    });
  }

  return data as T;
}
