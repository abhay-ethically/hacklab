'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, Target, AlertCircle, Flag, PenLine, FileText, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Level } from '@/lib/levelData';
import { useGameStore } from '@/lib/store';
import TrophyCelebration from './TrophyCelebration';

export default function ScenarioDetails({ level }: { level: Level }) {
  const [activeTab, setActiveTab] = useState<'mission' | 'hints' | 'writeup' | 'guide'>('mission');
  const [flag, setFlag] = useState('');
  const [result, setResult] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showTrophy, setShowTrophy] = useState(false);
  const submitFlag = useGameStore((s) => s.submitFlag);
  const isCompleted = useGameStore((s) => s.isCompleted);
  const useHint = useGameStore((s) => s.useHint);
  const isHintUsed = useGameStore((s) => s.isHintUsed);
  const setWriteup = useGameStore((s) => s.setWriteup);
  const getWriteup = useGameStore((s) => s.getWriteup);
  const [writeup, setWriteupLocal] = useState(getWriteup(level.id));

  useEffect(() => {
    setWriteupLocal(getWriteup(level.id));
  }, [level.id, getWriteup]);

  const handleSubmit = async () => {
    const correct = await submitFlag(level.id, flag);
    setResult(correct ? 'correct' : 'wrong');
    if (correct) {
      setFlag('');
      setShowTrophy(true);
      setTimeout(() => setShowTrophy(false), 3000);
    }
  };

  return (
    <section className="flex h-full flex-col gap-4 overflow-y-auto border-r border-hack-green/20 bg-hack-panel/30 p-4 sm:w-80">
      <div>
        <h1 className="mb-1 font-mono text-lg font-bold text-hack-green">{level.title}</h1>
        <span className="rounded bg-hack-green/10 px-2 py-0.5 font-mono text-xs text-hack-green">
          {level.category}
        </span>
      </div>

      <div className="space-y-3 text-sm leading-relaxed text-slate-300">
        <p>{level.description}</p>
        <div className="flex items-start gap-2 rounded border border-hack-amber/20 bg-hack-amber/5 p-2 text-hack-amber">
          <Target className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{level.objective}</p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <AlertCircle className="h-4 w-4" />
          Target: <span className="text-hack-cyan">{level.target}</span>
        </div>
      </div>

      <div className="flex gap-1 border-b border-hack-green/10 pb-1 font-mono text-xs">
        <button
          onClick={() => setActiveTab('mission')}
          className={`flex items-center gap-1 rounded px-2 py-1 ${
            activeTab === 'mission' ? 'bg-hack-green/10 text-hack-green' : 'text-slate-500'
          }`}
        >
          <Target className="h-3 w-3" /> Mission
        </button>
        <button
          onClick={() => {
            setActiveTab('hints');
            useHint(level.id);
          }}
          className={`flex items-center gap-1 rounded px-2 py-1 ${
            activeTab === 'hints' ? 'bg-hack-amber/10 text-hack-amber' : 'text-slate-500'
          }`}
        >
          <Lightbulb className="h-3 w-3" /> Hints
        </button>
        <button
          onClick={() => setActiveTab('writeup')}
          className={`flex items-center gap-1 rounded px-2 py-1 ${
            activeTab === 'writeup' ? 'bg-hack-cyan/10 text-hack-cyan' : 'text-slate-500'
          }`}
        >
          <FileText className="h-3 w-3" /> Write-up
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-1 rounded px-2 py-1 ${
            activeTab === 'guide' ? 'bg-hack-amber/10 text-hack-amber' : 'text-slate-500'
          }`}
        >
          <BookOpen className="h-3 w-3" /> Guide
        </button>
      </div>

      {activeTab === 'mission' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3 text-sm leading-relaxed text-slate-300"
        >
          <p>{level.description}</p>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <AlertCircle className="h-4 w-4" />
            Target: <span className="text-hack-cyan">{level.target}</span>
          </div>
        </motion.div>
      )}

      {activeTab === 'hints' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2"
        >
          {isHintUsed(level.id) && (
            <p className="rounded border border-hack-red/20 bg-hack-red/5 p-2 font-mono text-xs text-hack-red">
              -15 XP hint penalty applied for this mission.
            </p>
          )}
          <ul className="space-y-2 rounded border border-hack-amber/20 bg-hack-amber/5 p-3 text-xs text-slate-300">
            {level.hints.map((h, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-hack-amber">{i + 1}.</span>
                <code className="font-mono text-slate-200">{h}</code>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {activeTab === 'writeup' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-2"
        >
          <label className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <PenLine className="h-4 w-4" />
            Notes & Write-up
          </label>
          <textarea
            value={writeup}
            onChange={(e) => {
              setWriteupLocal(e.target.value);
              setWriteup(level.id, e.target.value);
            }}
            placeholder="Record your findings, payloads, and lessons learned..."
            className="h-40 w-full rounded border border-hack-cyan/20 bg-hack-bg p-2 font-mono text-xs text-slate-200 outline-none focus:border-hack-cyan"
          />
        </motion.div>
      )}

      {activeTab === 'guide' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2"
        >
          {level.guide ? (
            <ol className="list-decimal space-y-2 rounded border border-hack-amber/20 bg-hack-amber/5 p-3 pl-5 text-xs text-slate-300">
              {level.guide.map((step, i) => (
                <li key={i} className="font-mono leading-relaxed text-slate-200">
                  {step}
                </li>
              ))}
            </ol>
          ) : (
            <p className="font-mono text-xs text-slate-500">No guide available for this mission.</p>
          )}
        </motion.div>
      )}

      <div className="mt-auto">
        {isCompleted(level.id) ? (
          <div className="rounded border border-hack-green/30 bg-hack-green/10 p-3 text-center font-mono text-sm text-hack-green">
            Mission complete. Flag verified.
          </div>
        ) : (
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <Flag className="h-4 w-4" />
              Submit Flag
            </label>
            <input
              value={flag}
              onChange={(e) => {
                setFlag(e.target.value);
                setResult('idle');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="FLAG{...}"
              className="w-full rounded border border-hack-green/20 bg-hack-bg px-3 py-2 font-mono text-sm text-hack-green outline-none placeholder:text-slate-600 focus:border-hack-green"
            />
            <button
              onClick={handleSubmit}
              className="w-full rounded bg-hack-green/20 py-2 font-mono text-sm font-bold text-hack-green hover:bg-hack-green/30"
            >
              SUBMIT
            </button>
            {result === 'correct' && (
              <p className="text-center font-mono text-xs text-hack-green">Flag accepted.</p>
            )}
            {result === 'wrong' && (
              <p className="text-center font-mono text-xs text-hack-red">Invalid flag.</p>
            )}
          </div>
        )}
      </div>

      <TrophyCelebration show={showTrophy} flag={level.flag} />
    </section>
  );
}
