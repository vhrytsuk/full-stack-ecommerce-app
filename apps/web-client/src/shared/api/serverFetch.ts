import { clientConfig } from "@/shared/config";

import { ApiError } from "./ApiError";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

/**
 * Server-side fetch wrapper for talking to the backend API from Server
 * Components and Server Actions.
 *
 * It returns the raw `Response` so callers (e.g. a BFF Server Action) can
 * forward `Set-Cookie` headers to the browser. Use `parseJson` to read and
 * normalize the JSON body.
 */
export async function serverFetch(
  path: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { body, headers, ...rest } = options;
  const url = `${clientConfig.apiBaseUrl}${path}`;

  return fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
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
