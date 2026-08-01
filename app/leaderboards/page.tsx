'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Check, Radio } from 'lucide-react';
import { levels } from '@/lib/levelData';
import { useGameStore, rankForCompleted } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';

export default function Leaderboards() {
  const { xp, completed, reset, username, leaderboard } = useGameStore();
  const rank = rankForCompleted(completed.length);
  const [remote, setRemote] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        const json = await res.json();
        setRemote(json.leaderboard || []);
        setError(null);
      } catch (e) {
        setError('Could not load live leaderboard.');
      }
    };
    load();

    const channel = supabase
      .channel('leaderboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leaderboard_totals' },
        () => {
          load();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="mx-auto max-w-4xl overflow-y-auto p-6">
      <h1 className="mb-6 font-mono text-2xl font-bold text-hack-green">Operator Stats</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded border border-hack-green/20 bg-hack-panel/40 p-4">
          <p className="font-mono text-xs text-slate-500">Total XP</p>
          <p className="font-mono text-2xl font-bold text-hack-green">{xp}</p>
        </div>
        <div className="rounded border border-hack-green/20 bg-hack-panel/40 p-4">
          <p className="font-mono text-xs text-slate-500">Missions Cleared</p>
          <p className="font-mono text-2xl font-bold text-hack-green">
            {completed.length}/{levels.length}
          </p>
        </div>
        <div className="rounded border border-hack-green/20 bg-hack-panel/40 p-4">
          <p className="font-mono text-xs text-slate-500">Rank</p>
          <p className="font-mono text-2xl font-bold text-hack-amber">{rank}</p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-sm text-slate-300">
          <Trophy className="h-4 w-4 text-hack-amber" />
          Progress to Domain Admin
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded border border-hack-red/30 px-3 py-1.5 font-mono text-xs text-hack-red hover:bg-hack-red/10"
        >
          <RotateCcw className="h-3 w-3" />
          Reset Progress
        </button>
      </div>

      <div className="mb-8 h-3 w-full overflow-hidden rounded bg-hack-panel">
        <motion.div
          className="h-full bg-hack-green"
          initial={{ width: 0 }}
          animate={{ width: `${(completed.length / levels.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <h2 className="mb-4 flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-hack-green/70">
        <Radio className="h-4 w-4 text-hack-red animate-pulse" /> Live Leaderboard
      </h2>
      <div className="mb-8 rounded border border-hack-green/20 bg-hack-panel/40 p-4">
        {remote.length === 0 && leaderboard.length === 0 && !error ? (
          <p className="font-mono text-xs text-slate-500">
            No scores yet. Sign in with Google and capture a flag to be the first.
          </p>
        ) : (
          <table className="w-full text-left font-mono text-sm">
            <thead className="text-xs text-slate-500">
              <tr>
                <th className="pb-2">#</th>
                <th className="pb-2">Operator</th>
                <th className="pb-2">XP</th>
                <th className="pb-2">Missions</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {(remote.length > 0 ? remote : leaderboard).map((e, i) => (
                <tr
                  key={e.user_id || e.name}
                  className={`border-t border-hack-green/10 ${
                    (e.username || e.name) === username ? 'text-hack-green' : ''
                  }`}
                >
                  <td className="py-2">{i + 1}</td>
                  <td className="py-2">{e.username || e.name}</td>
                  <td className="py-2">{e.xp}</td>
                  <td className="py-2">{e.completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {error && (
        <p className="mb-4 font-mono text-xs text-hack-red">{error}</p>
      )}

      <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-hack-green/70">
        Completed Missions
      </h2>

      <ul className="space-y-2">
        {levels.map((l) => {
          const done = completed.includes(l.id);
          return (
            <li
              key={l.id}
              className={`flex items-center justify-between rounded border px-4 py-3 font-mono text-sm ${
                done
                  ? 'border-hack-green/20 bg-hack-green/5 text-hack-green'
                  : 'border-slate-800 bg-hack-panel/40 text-slate-500'
              }`}
            >
              <span>
                {l.id}. {l.title}
              </span>
              {done && <Check className="h-4 w-4 text-hack-green" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
