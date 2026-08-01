'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Terminal } from 'lucide-react';
import { useGameStore } from '@/lib/store';

export default function NameModal() {
  const username = useGameStore((s) => s.username);
  const setUsername = useGameStore((s) => s.setUsername);
  const [draft, setDraft] = useState('');
  const open = !username;

  const save = () => {
    const name = draft.trim();
    if (!name) return;
    setUsername(name);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-hack-bg/90 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -10 }}
            className="w-full max-w-sm rounded border border-hack-green/30 bg-hack-panel p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center gap-3 text-hack-green">
              <Terminal className="h-6 w-6" />
              <h2 className="font-mono text-lg font-bold">Operator Check-In</h2>
            </div>
            <p className="mb-4 font-mono text-xs text-slate-400">
              Enter your callsign. No password is required — this is a lightweight guest session.
            </p>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && save()}
              placeholder="0xGhost"
              className="mb-4 w-full rounded border border-hack-green/20 bg-hack-bg px-3 py-2 font-mono text-sm text-hack-green outline-none placeholder:text-slate-600 focus:border-hack-green"
            />
            <button
              onClick={save}
              className="w-full rounded bg-hack-green/20 py-2 font-mono text-sm font-bold text-hack-green hover:bg-hack-green/30"
            >
              ENTER HACKLAB
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
