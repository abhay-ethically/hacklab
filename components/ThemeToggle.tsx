'use client';

import { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';

const THEMES = ['dark', 'light', 'ocean'] as const;
type Theme = (typeof THEMES)[number];

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const saved = (localStorage.getItem('hacklab-theme') as Theme) || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hacklab-theme', theme);
  }, [theme]);

  return (
    <div className="flex items-center gap-1 rounded border border-hack-green/30 bg-hack-bg px-2 py-1">
      <Palette className="h-3 w-3 text-hack-green" />
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
        className="bg-transparent font-mono text-xs text-hack-green outline-none"
        aria-label="Theme"
      >
        {THEMES.map((t) => (
          <option key={t} value={t} className="bg-hack-panel text-slate-200 capitalize">
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}
