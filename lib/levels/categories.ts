import { levels } from '.';

export interface CategoryInfo {
  name: string;
  slug: string;
  count: number;
}

export const categories: CategoryInfo[] = Array.from(
  new Set(levels.map((l) => l.category))
).map((name) => ({
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  count: levels.filter((l) => l.category === name).length,
}));

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return categories.find((c) => c.slug === slug);
}

export function slugForCategory(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
