import type { Category } from "@repo/api-contracts";

import type { CategoryTreeNode } from "../model/categoryTypes";

/**
 * Converts the backend's flat category list into a parent/child tree.
 *
 * Pure and framework-agnostic so it can run on the server (menu rendering) or
 * be unit-tested in isolation. Root categories are those without a `parentId`.
 */
export function buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
  const nodesById = new Map<string, CategoryTreeNode>();

  for (const category of categories) {
    nodesById.set(category.id, { ...category, children: [] });
  }

  const roots: CategoryTreeNode[] = [];

  for (const node of nodesById.values()) {
    if (node.parentId && nodesById.has(node.parentId)) {
      nodesById.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
