'use client';

import { useParams, notFound } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { levels, getLevel } from '@/lib/levelData';
import LevelSidebar from '@/components/LevelSidebar';
import ScenarioDetails from '@/components/ScenarioDetails';
import Terminal from '@/components/Terminal';
import VirtualBrowser from '@/components/VirtualBrowser';

export default function PlayPage() {
  const params = useParams();
  const levelId = Array.isArray(params.levelId) ? params.levelId[0] : params.levelId;
  const level = getLevel(levelId);
  const [tab, setTab] = useState<'terminal' | 'browser'>('terminal');

  if (!level) return notFound();

  return (
    <div className="flex h-full flex-col lg:flex-row">
      <LevelSidebar activeId={level.id} />

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <ScenarioDetails level={level} />

        <section className="flex flex-1 flex-col border-l border-hack-green/20 bg-hack-bg">
          <div className="flex border-b border-hack-green/20 bg-hack-panel/50">
            <button
              onClick={() => setTab('terminal')}
              className={`px-5 py-2 font-mono text-xs font-bold ${
                tab === 'terminal' ? 'text-hack-green' : 'text-slate-500'
              }`}
            >
              1. Terminal
            </button>
            {level.type === 'web' ? (
              <button
                onClick={() => setTab('browser')}
                className={`px-5 py-2 font-mono text-xs font-bold ${
                  tab === 'browser' ? 'text-hack-green' : 'text-slate-500'
                }`}
              >
                2. Target Web Preview
              </button>
            ) : (
              <span className="px-5 py-2 font-mono text-xs text-slate-700">
                2. Target Web Preview
              </span>
            )}
          </div>

          <div className="relative min-h-0 flex-1 p-2">
            {tab === 'terminal' ? (
              <motion.div
                key="terminal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[24rem] overflow-hidden rounded border border-hack-green/20 bg-hack-panel/40"
              >
                <Terminal levelId={level.id} />
              </motion.div>
            ) : level.webComponent ? (
              <motion.div
                key="browser"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[24rem] overflow-hidden rounded border border-hack-green/20"
              >
                <VirtualBrowser level={level} />
              </motion.div>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500">
                This mission uses the terminal only.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
