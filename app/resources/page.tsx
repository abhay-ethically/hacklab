import { resourcesByCategory } from '@/lib/resources';
import { ExternalLink, BookOpen } from 'lucide-react';

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-2 flex items-center gap-2 font-mono text-2xl font-bold text-hack-green">
        <BookOpen className="h-6 w-6" />
        Learning Resources
      </h1>
      <p className="mb-8 font-mono text-sm text-slate-400">
        Curated tools and references for every mission category.
      </p>

      <div className="space-y-6">
        {resourcesByCategory.map((cat) => (
          <div
            key={cat.category}
            className="rounded border border-hack-green/20 bg-hack-panel/40 p-4"
          >
            <h2 className="mb-1 font-mono text-lg font-bold text-hack-amber">{cat.category}</h2>
            <p className="mb-4 font-mono text-xs text-slate-500">{cat.description}</p>
            <ul className="space-y-2">
              {cat.resources.map((r) => (
                <li key={r.href}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2 font-mono text-sm text-slate-300 hover:text-hack-green"
                  >
                    <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <span className="font-bold">{r.title}</span>
                      <span className="ml-2 text-xs text-slate-500">{r.description}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
