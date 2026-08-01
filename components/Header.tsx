'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Volume2, VolumeX, Terminal, Trophy, User, LogIn, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameStore, rankForCompleted } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';

export default function Header() {
  const { xp, completed, soundEnabled, toggleSound, username, setUsername } = useGameStore();
  const syncFromSupabase = useGameStore((s) => s.syncFromSupabase);
  const reset = useGameStore((s) => s.reset);
  const rank = rankForCompleted(completed.length);
  const [session, setSession] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const apply = (session: any) => {
      setSession(session);
      if (session?.user) {
        const name =
          session.user.user_metadata?.user_name ||
          session.user.user_metadata?.name ||
          session.user.email?.split('@')[0] ||
          'Operator';
        setUsername(name);
        syncFromSupabase();
      } else {
        reset();
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      apply(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      apply(session);
    });

    return () => sub.subscription.unsubscribe();
  }, [supabase, setUsername, syncFromSupabase, reset]);

  const signOut = async () => {
    await supabase.auth.signOut();
    reset();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-hack-green/20 bg-hack-panel/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-hack-green">
          <Terminal className="h-5 w-5" />
          <span className="font-mono text-lg font-bold tracking-wider">HackLab</span>
        </Link>

        <div className="flex items-center gap-4 text-sm font-mono">
          <motion.div
            className="hidden items-center gap-2 sm:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Trophy className="h-4 w-4 text-hack-amber" />
            <span className="text-hack-amber">{rank}</span>
          </motion.div>

          <div className="flex items-center gap-4 text-slate-400">
            {username && (
              <span className="hidden items-center gap-1 sm:flex" title="Operator">
                <User className="h-3 w-3 text-hack-cyan" />
                <span className="text-hack-cyan">{username}</span>
              </span>
            )}
            <span>
              <span className="text-hack-green">XP:</span> {xp}
            </span>
            <span>
              <span className="text-hack-green">LVL:</span> {completed.length}/25
            </span>
          </div>

          {session ? (
            <button
              onClick={signOut}
              className="flex items-center gap-1 rounded border border-hack-red/30 px-2 py-1.5 font-mono text-xs text-hack-red hover:bg-hack-red/10"
            >
              <LogOut className="h-3 w-3" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 rounded border border-hack-green/30 px-2 py-1.5 font-mono text-xs text-hack-green hover:bg-hack-green/10"
            >
              <LogIn className="h-3 w-3" />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
          )}

          <button
            onClick={toggleSound}
            className="rounded border border-hack-green/30 p-1.5 text-hack-green hover:bg-hack-green/10"
            aria-label="Toggle sound"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
