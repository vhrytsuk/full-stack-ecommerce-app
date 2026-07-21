import Link from "next/link";

import type { Category } from "../model/categoryTypes";

/**
 * Basic link representation of a category. An entity owns how a business object
 * is displayed; actions (open menu, filter) live in features/widgets.
 */
export function CategoryLink({
  category,
  className,
  onNavigate,
}: {
  category: Pick<Category, "name" | "slug">;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={className}
      onClick={onNavigate}
    >
      {category.name}
    </Link>
  );
}
