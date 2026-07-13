import { defaultLocale, type Locale } from "./config";

/**
 * Resolves the active locale for the current request.
 *
 * Localization is not enabled yet, so this always returns the default locale.
 * When localization is introduced, update this single function to read the
 * locale from the route segment, a cookie, or the `Accept-Language` header.
 */
export function getCurrentLocale(): Locale {
  return defaultLocale;
}
