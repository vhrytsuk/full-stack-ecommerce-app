// Base URL used by the browser. `NEXT_PUBLIC_*` vars are inlined into the
// client bundle, so this must be reachable from the user's machine.
const PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

// Base URL used by server-side code (Server Actions / Server Components).
// Inside Docker the backend is reachable via its service name, not
// `localhost`, so this can be set independently (e.g. http://backend:4000/api/v1).
// Falls back to the public URL for local, non-container development.
const SERVER_API_BASE_URL =
  process.env.API_BASE_URL_INTERNAL ?? PUBLIC_API_BASE_URL;

export const clientConfig = {
  /** For browser (client component) requests. */
  apiBaseUrl: PUBLIC_API_BASE_URL,
  /** For server-side requests (Server Actions, Server Components). */
  serverApiBaseUrl: SERVER_API_BASE_URL,
} as const;
