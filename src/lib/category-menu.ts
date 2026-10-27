import type { Category } from "@/types";

export function validMenuCategory(category: Category): boolean {
  return typeof category.id === "string" && category.id.trim().length > 0 &&
    !category.id.includes("/") && category.id !== "." && category.id !== ".." &&
    typeof category.name === "string" && category.name.trim().length > 0;
}

// Legacy subcategories are strings. Resolve them to real documents before
// offering a submenu; a label alone cannot provide a working category link.
export function getCategoryChildren(category: Category, categories: Category[]): Category[] {
  const references: unknown[] = Array.isArray(category.subcategories) ? category.subcategories : [];
  const children = new Map<string, Category>();
  for (const reference of references) {
    if (typeof reference !== "string" || !reference.trim()) continue;
    const value = reference.trim();
    const candidates = categories.filter((child) => validMenuCategory(child) && child.id !== category.id);
    const exact = candidates.find((child) => child.id === value);
    const matches = exact ? [exact] : candidates.filter((child) => child.slug === value || child.name.trim() === value);
    if (matches.length === 1) children.set(matches[0].id, matches[0]);
  }
  return [...children.values()];
}

export function categoryHref(category: Category): string {
  return `/products?category=${encodeURIComponent(category.id)}`;
}
