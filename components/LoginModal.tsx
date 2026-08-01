'use client';

import { useEffect, useState } from 'react';
import { X, LogIn } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) setOpen(true);
    });
  }, []);

  const signIn = async () => {
    setLoading(true);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await createClient().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${origin}/auth/callback` },
    });
    if (error) {
      setLoading(false);
      alert(error.message);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded border border-hack-green/30 bg-hack-panel p-6 shadow-[0_0_20px_rgba(0,255,102,0.1)]">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="font-mono text-lg font-bold text-hack-green">Save Your Progress</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-slate-400 hover:text-hack-green"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mb-6 font-mono text-sm text-slate-300">
          Sign in with Google to sync your XP, completed missions, and leaderboard rank across devices.
        </p>
        <button
          onClick={signIn}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded border border-hack-green/30 px-4 py-2 font-mono text-sm text-hack-green hover:bg-hack-green/10 disabled:opacity-50"
        >
          <LogIn className="h-4 w-4" />
          {loading ? 'Opening Google…' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
}
