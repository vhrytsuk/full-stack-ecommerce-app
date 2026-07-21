import type { Category } from "@repo/api-contracts";

export type { Category } from "@repo/api-contracts";

/**
 * A category with its direct children resolved into a tree node. Built on the
 * client side from the flat list the backend returns.
 */
export type CategoryTreeNode = Category & {
  children: CategoryTreeNode[];
};
