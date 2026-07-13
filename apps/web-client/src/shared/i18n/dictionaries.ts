import { defaultLocale, type Locale } from "./config";
import en from "./dictionaries/en";

/**
 * The English dictionary is the source of truth for the shape of all
 * translations. Every other locale must satisfy `Dictionary`.
 */
export type Dictionary = typeof en;

/**
 * Lazy dictionary loaders keyed by locale. Using dynamic imports keeps each
 * locale in its own chunk so we only ship the active language.
 */
const dictionaries: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  en: () => import("./dictionaries/en"),
};

export async function getDictionary(
  locale: Locale = defaultLocale
): Promise<Dictionary> {
  const load = dictionaries[locale] ?? dictionaries[defaultLocale];
  const dictionary = await load();
  return dictionary.default;
}
