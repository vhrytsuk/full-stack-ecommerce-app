import { buildCategoryTree, getCategories } from "@/entities/category";
import { getCurrentLocale, getDictionary } from "@/shared/i18n";

import { CategoryMenu } from "./CategoryMenu";

/**
 * Server component: fetches categories on the server and hands the tree to the
 * interactive client menu. Keeping the fetch here means the client bundle
 * stays small and data loads without a client round-trip.
 */
export async function CategoryMenuTrigger() {
  const [categories, dictionary] = await Promise.all([
    getCategories(),
    getDictionary(getCurrentLocale()),
  ]);

  const tree = buildCategoryTree(categories);
  const t = dictionary.categoryMenu;

  return (
    <CategoryMenu
      categories={tree}
      labels={{
        trigger: t.trigger,
        title: t.title,
        allProducts: t.allProducts,
      }}
    />
  );
}
