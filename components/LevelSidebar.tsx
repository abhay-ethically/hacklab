'use client';

import Link from 'next/link';
import { Check, Lock, Unlock } from 'lucide-react';
import { motion } from 'framer-motion';
import { levels } from '@/lib/levelData';
import { useGameStore } from '@/lib/store';

export default function LevelSidebar({ activeId }: { activeId?: string }) {
  const { completed, unlocked } = useGameStore();

  return (
    <aside className="h-full w-full overflow-y-auto border-r border-hack-green/20 bg-hack-panel/50 p-3 sm:w-72">
      <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-hack-green/70">
        Mission Tree
      </h2>
      <ul className="space-y-2">
        {levels.map((level) => {
          const isDone = completed.includes(level.id);
          const isOpen = unlocked.includes(level.id) || isDone;
          return (
            <li key={level.id}>
              <Link
                href={`/play/${level.id}`}
                className={`flex items-center justify-between rounded border px-3 py-2 font-mono text-sm transition ${
                  activeId === level.id
                    ? 'border-hack-green bg-hack-green/10 text-hack-green'
                    : 'border-hack-green/10 bg-hack-bg text-slate-300 hover:border-hack-green/30'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{level.id}.</span>
                  <span className="truncate">{level.title}</span>
                </span>
                {isDone ? (
                  <Check className="h-4 w-4 text-hack-green" />
                ) : isOpen ? (
                  <Unlock className="h-3 w-3 text-slate-500" />
                ) : (
                  <Lock className="h-3 w-3 text-slate-600" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
