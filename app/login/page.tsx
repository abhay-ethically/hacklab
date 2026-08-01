'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Github, Chrome } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const signInWithGitHub = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-sm rounded border border-hack-green/30 bg-hack-panel p-8 text-center shadow-2xl">
        <h1 className="mb-2 font-mono text-2xl font-bold text-hack-green">
          Operator Auth
        </h1>
        <p className="mb-6 font-mono text-xs text-slate-400">
          Sign in securely to record verified scores.
        </p>

        <div className="space-y-3">
          <button
            onClick={signInWithGitHub}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded bg-hack-green/20 py-3 font-mono text-sm font-bold text-hack-green transition hover:bg-hack-green/30 disabled:opacity-50"
          >
            <Github className="h-4 w-4" />
            Sign in with GitHub
          </button>

          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded bg-hack-cyan/20 py-3 font-mono text-sm font-bold text-hack-cyan transition hover:bg-hack-cyan/30 disabled:opacity-50"
          >
            <Chrome className="h-4 w-4" />
            Sign in with Google
          </button>
        </div>

        {error && (
          <p className="mt-4 font-mono text-xs text-hack-red">{error}</p>
        )}

        <p className="mt-6 font-mono text-[10px] text-slate-500">
          Sessions are server-side cookies. No tokens in localStorage.
        </p>
      </div>
    </div>
  );
}
