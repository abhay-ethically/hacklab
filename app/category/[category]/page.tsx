import { notFound } from 'next/navigation';
import Link from 'next/link';
import { levels } from '@/lib/levelData';
import { getCategoryBySlug, slugForCategory } from '@/lib/levels/categories';

export function generateStaticParams() {
  const slugs = Array.from(new Set(levels.map((l) => slugForCategory(l.category))));
  return slugs.map((category) => ({ category }));
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const info = getCategoryBySlug(params.category);
  if (!info) return notFound();

  const categoryLevels = levels
    .filter((l) => l.category === info.name)
    .sort((a, b) => parseInt(a.id) - parseInt(b.id));

  return (
    <div className="mx-auto max-w-6xl overflow-y-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-mono text-2xl font-bold text-hack-green">{info.name}</h1>
        <span className="font-mono text-sm text-slate-500">{info.count} missions</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categoryLevels.map((level) => (
          <Link
            key={level.id}
            href={`/play/${level.id}`}
            className="block h-full rounded border border-hack-green/20 bg-hack-panel/40 p-4 transition hover:border-hack-green/50 hover:shadow-[0_0_15px_rgba(0,255,102,0.1)]"
          >
            <span className="font-mono text-xs text-slate-500">#{level.id}</span>
            <h3 className="mt-1 font-mono text-sm font-bold text-slate-200">{level.title}</h3>
            <p className="mt-2 line-clamp-2 font-mono text-xs text-slate-400">{level.description}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Link href="/" className="font-mono text-sm text-hack-green hover:underline">
          ← Back to all missions
        </Link>
      </div>
    </div>
  );
}
