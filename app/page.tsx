'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Terminal, Trophy, Play } from 'lucide-react';
import { levels } from '@/lib/levelData';
import { useGameStore, rankForCompleted } from '@/lib/store';
import { categories } from '@/lib/levels/categories';
import LoginModal from '@/components/LoginModal';

export default function Dashboard() {
  const { completed, unlocked } = useGameStore();
  const rank = rankForCompleted(completed.length);

  return (
    <>
      <LoginModal />
      <div className="mx-auto max-w-6xl overflow-y-auto p-6">
      <section className="mb-8 rounded border border-hack-green/20 bg-hack-panel/40 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 font-mono text-3xl font-bold text-hack-green">
              Welcome to HackLab
            </h1>
            <p className="max-w-2xl font-mono text-sm text-slate-400">
              A purely client-side CTF dojo. Explore 20 real-world offensive
              security scenarios across Linux, Web, Crypto, and Active
              Directory.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-hack-amber" />
            <div>
              <p className="font-mono text-xs text-slate-500">Current Rank</p>
              <p className="font-mono text-lg font-bold text-hack-amber">{rank}</p>
            </div>
          </div>
        </div>
      </section>

      <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-hack-green/70">
        Categories
      </h2>
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="rounded border border-hack-green/20 bg-hack-panel/40 p-3 transition hover:border-hack-green/50"
          >
            <p className="font-mono text-sm font-bold text-slate-200">{cat.name}</p>
            <p className="font-mono text-xs text-slate-500">{cat.count} missions</p>
          </Link>
        ))}
      </div>

      <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-hack-green/70">
        Training Missions
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {levels.map((level, i) => {
          const isDone = completed.includes(level.id);
          const isOpen = unlocked.includes(level.id) || isDone;
          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                href={isOpen ? `/play/${level.id}` : '#'}
                className={`block h-full rounded border bg-hack-panel/40 p-4 transition hover:shadow-[0_0_15px_rgba(0,255,102,0.1)] ${
                  isOpen
                    ? 'border-hack-green/20 hover:border-hack-green/50'
                    : 'border-slate-800 opacity-60'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <Terminal className="h-4 w-4 text-hack-green" />
                  <span className="font-mono text-xs text-slate-500">
                    {isDone ? 'COMPLETED' : isOpen ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                </div>
                <h3 className="mb-1 font-mono text-sm font-bold text-slate-200">
                  {level.id}. {level.title}
                </h3>
                <p className="mb-3 font-mono text-xs text-hack-amber">
                  {level.category}
                </p>
                <p className="line-clamp-2 font-mono text-xs text-slate-400">
                  {level.description}
                </p>
                <div className="mt-3 flex items-center gap-2 text-hack-green">
                  <Play className="h-3 w-3" />
                  <span className="font-mono text-xs font-bold">
                    {isOpen ? 'START MISSION' : 'LOCKED'}
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
    </>
  );
}
