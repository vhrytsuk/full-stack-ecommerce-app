import { cookies } from "next/headers";

type CookieOptions = {
  name: string;
  value: string;
  httpOnly?: boolean;
  secure?: boolean;
  path?: string;
  sameSite?: "lax" | "strict" | "none";
  maxAge?: number;
  expires?: Date;
};

/**
 * Forwards `Set-Cookie` headers from a backend response onto the browser via
 * Next's cookie store.
 *
 * Shared by every BFF auth action (sign-in, sign-up, refresh, logout) so that
 * HttpOnly session cookies issued by the backend are re-issued to the client
 * without ever being exposed to client JavaScript.
 */
export async function forwardSetCookies(response: Response): Promise<void> {
  const setCookieHeaders = response.headers.getSetCookie();
  if (setCookieHeaders.length === 0) return;

  const cookieStore = await cookies();
  for (const header of setCookieHeaders) {
    cookieStore.set(parseSetCookie(header));
  }
}

/**
 * Parses a single `Set-Cookie` header into options accepted by Next's cookie
 * store. Only the attributes our backend emits are handled.
 */
function parseSetCookie(header: string): CookieOptions {
  const [pair, ...attributes] = header.split(";").map((part) => part.trim());
  const [name, ...valueParts] = pair!.split("=");

  const options: CookieOptions = {
    name: name!,
    value: valueParts.join("="),
  };

  for (const attribute of attributes) {
    const [rawKey, rawValue] = attribute.split("=");
    const key = rawKey!.toLowerCase();

    switch (key) {
      case "httponly":
        options.httpOnly = true;
        break;
      case "secure":
        options.secure = true;
        break;
      case "path":
        options.path = rawValue;
        break;
      case "samesite":
        options.sameSite = rawValue!.toLowerCase() as CookieOptions["sameSite"];
        break;
      case "max-age":
        options.maxAge = Number(rawValue);
        break;
      case "expires":
        options.expires = new Date(rawValue!);
        break;
    }
  }

  return options;
}
