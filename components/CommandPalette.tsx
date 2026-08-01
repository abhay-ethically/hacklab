'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Terminal, Trophy, Home, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { levels } from '@/lib/levelData';

const TOOLS = [
  'nmap', 'dirb', 'gobuster', 'exiftool', 'strings', 'base64', 'md5',
  'john', 'curl', 'aws', 'ssh', 'vim', 'sudo', 'grep', 'find', 'ls',
  'cat', 'cd', 'ftp', 'GetUserSPNs.py'
];

interface PaletteItem {
  id: string;
  label: string;
  detail?: string;
  type: 'level' | 'tool' | 'page';
  href?: string;
  command?: string;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const items: PaletteItem[] = useMemo(() => {
    const levelItems: PaletteItem[] = levels.map((l) => ({
      id: l.id,
      label: `${l.id}. ${l.title}`,
      detail: l.category,
      type: 'level',
      href: `/play/${l.id}`,
    }));
    const toolItems: PaletteItem[] = TOOLS.map((t) => ({
      id: `tool-${t}`,
      label: t,
      detail: 'tool',
      type: 'tool',
      command: t,
    }));
    const pageItems: PaletteItem[] = [
      { id: 'page-home', label: 'Dashboard', detail: 'page', type: 'page', href: '/' },
      { id: 'page-leaderboards', label: 'Leaderboards', detail: 'page', type: 'page', href: '/leaderboards' },
    ];
    return [...pageItems, ...levelItems, ...toolItems];
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return items.slice(0, 12);
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        (i.detail && i.detail.toLowerCase().includes(q))
    );
  }, [items, query]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const select = (item: PaletteItem) => {
    setOpen(false);
    setQuery('');
    if (item.href) {
      router.push(item.href);
    } else if (item.command) {
      // Copy to clipboard for quick use in terminal
      navigator.clipboard?.writeText(item.command);
    }
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selected]) select(filtered[selected]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const iconFor = (item: PaletteItem) => {
    if (item.type === 'level') return <Terminal className="h-4 w-4 text-hack-green" />;
    if (item.type === 'tool') return <Command className="h-4 w-4 text-hack-cyan" />;
    if (item.label.includes('Leaderboards')) return <Trophy className="h-4 w-4 text-hack-amber" />;
    return <Home className="h-4 w-4 text-hack-amber" />;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-hack-bg/80 p-4 pt-24"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -10 }}
            className="w-full max-w-2xl overflow-hidden rounded border border-hack-green/30 bg-hack-panel shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-hack-green/20 p-3">
              <Search className="h-4 w-4 text-hack-green" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Search missions, tools, and pages..."
                className="w-full bg-transparent font-mono text-sm text-slate-200 outline-none placeholder:text-slate-600"
              />
              <span className="font-mono text-xs text-slate-500">Esc</span>
            </div>
            <ul className="max-h-80 overflow-y-auto p-2 font-mono text-sm">
              {filtered.map((item, i) => (
                <li
                  key={item.id}
                  onClick={() => select(item)}
                  onMouseEnter={() => setSelected(i)}
                  className={`flex cursor-pointer items-center gap-3 rounded px-3 py-2 ${
                    i === selected ? 'bg-hack-green/10 text-hack-green' : 'text-slate-300 hover:bg-hack-green/5'
                  }`}
                >
                  {iconFor(item)}
                  <span className="flex-1">{item.label}</span>
                  {item.detail && (
                    <span className="text-xs text-slate-500">{item.detail}</span>
                  )}
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-3 py-2 text-slate-500">No matches</li>
              )}
            </ul>
            <div className="flex gap-3 border-t border-hack-green/10 p-2 text-xs text-slate-500">
              <span>↑↓ to navigate</span>
              <span>↵ to select</span>
              <span className="ml-auto">Ctrl/Cmd + Shift + P</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
