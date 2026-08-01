'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, Radio } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Entry {
  user_id: string;
  username: string;
  xp: number;
  completed: number;
  updated_at: string;
}

export default function LeaderboardPreview() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        const json = await res.json();
        setEntries((json.leaderboard || []).slice(0, 5));
        setError(null);
      } catch (e) {
        setError('Could not load live leaderboard.');
      }
    };
    load();

    const channel = supabase
      .channel('home-leaderboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leaderboard_totals' },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <section className="mb-8 rounded border border-hack-green/20 bg-hack-panel/40 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-hack-green/70">
          <Radio className="h-4 w-4 animate-pulse text-hack-red" /> Live Leaderboard
        </h2>
        <Link href="/leaderboards" className="font-mono text-xs text-hack-amber hover:underline">
          View all →
        </Link>
      </div>
      {entries.length === 0 && !error ? (
        <p className="font-mono text-xs text-slate-500">
          No scores yet. Sign in and capture a flag to be the first.
        </p>
      ) : (
        <div className="space-y-2">
          {entries.map((e, i) => (
            <div
              key={e.user_id}
              className="flex items-center justify-between rounded border border-hack-green/10 bg-hack-bg px-3 py-2 font-mono text-sm text-slate-300"
            >
              <div className="flex items-center gap-3">
                <Trophy className="h-3 w-3 text-hack-amber" />
                <span className="text-slate-400">#{i + 1}</span>
                <span className="text-slate-200">{e.username || 'Operator'}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>XP {e.xp}</span>
                <span>{e.completed} missions</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {error && <p className="mt-2 font-mono text-xs text-hack-red">{error}</p>}
    </section>
  );
}
