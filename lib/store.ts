import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { levels, getLevel } from './levelData';

interface LeaderboardEntry {
  name: string;
  xp: number;
  completed: number;
  updatedAt: string;
}

interface GameState {
  xp: number;
  completed: string[];
  unlocked: string[];
  soundEnabled: boolean;
  hintUsed: string[];
  writeups: Record<string, string>;
  username: string;
  leaderboard: LeaderboardEntry[];
  toggleSound: () => void;
  submitFlag: (levelId: string, flag: string) => Promise<boolean>;
  isCompleted: (levelId: string) => boolean;
  isUnlocked: (levelId: string) => boolean;
  useHint: (levelId: string) => void;
  isHintUsed: (levelId: string) => boolean;
  setWriteup: (levelId: string, text: string) => void;
  getWriteup: (levelId: string) => string;
  setUsername: (name: string) => void;
  recordScore: () => void;
  syncFromSupabase: () => Promise<void>;
  reset: () => void;
}

const initialUnlocked = ['1'];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      completed: [],
      unlocked: initialUnlocked,
      soundEnabled: true,
      hintUsed: [],
      writeups: {},
      username: '',
      leaderboard: [],

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      submitFlag: async (levelId: string, flag: string) => {
        const level = getLevel(levelId);
        if (!level) return false;
        if (flag.trim() === level.flag) {
          const already = get().completed.includes(levelId);
          if (!already) {
            const currentIndex = levels.findIndex((l) => l.id === levelId);
            const next = currentIndex >= 0 ? levels[currentIndex + 1] : undefined;
            set((state) => ({
              completed: [...state.completed, levelId],
              xp: state.xp + level.xp,
              unlocked: next && !state.unlocked.includes(next.id)
                ? [...state.unlocked, next.id]
                : state.unlocked,
            }));
          }
          get().recordScore();

          try {
            await fetch('/api/score', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ levelId, flag: flag.trim() }),
            });
          } catch (err) {
            // offline / unauthenticated: local game still works
            console.error('Score sync failed', err);
          }

          return true;
        }
        return false;
      },

      isCompleted: (levelId: string) => get().completed.includes(levelId),

      isUnlocked: (levelId: string) =>
        get().unlocked.includes(levelId) || get().completed.includes(levelId),

      useHint: (levelId: string) => {
        if (!get().hintUsed.includes(levelId)) {
          set((state) => ({
            hintUsed: [...state.hintUsed, levelId],
            xp: Math.max(0, state.xp - 15),
          }));
        }
      },

      isHintUsed: (levelId: string) => get().hintUsed.includes(levelId),

      setWriteup: (levelId: string, text: string) =>
        set((state) => ({ writeups: { ...state.writeups, [levelId]: text } })),

      getWriteup: (levelId: string) => get().writeups[levelId] || '',

      setUsername: (name: string) => set({ username: name.trim() }),

      syncFromSupabase: async () => {
        try {
          const res = await fetch('/api/progress');
          if (res.status === 401) {
            get().reset();
            return;
          }
          const data = await res.json();
          if (data.error) {
            get().reset();
            return;
          }
          const completed = (data.completed as string[]) || [];
          const max = Math.max(0, ...completed.map((id) => parseInt(id, 10)));
          const next = levels.find((l) => parseInt(l.id, 10) === max + 1);
          const unlocked = Array.from(new Set(['1', ...completed, ...(next ? [next.id] : [])]));
          set({
            completed,
            xp: data.xp || 0,
            username: data.username || get().username,
            unlocked,
          });
          get().recordScore();
        } catch (err) {
          console.error('Progress sync failed', err);
          get().reset();
        }
      },

      recordScore: () => {
        const state = get();
        if (!state.username) return;
        const next: LeaderboardEntry = {
          name: state.username,
          xp: state.xp,
          completed: state.completed.length,
          updatedAt: new Date().toISOString(),
        };
        const list = state.leaderboard.filter((e) => e.name !== state.username);
        list.push(next);
        list.sort((a, b) => b.xp - a.xp || b.completed - a.completed);
        set({ leaderboard: list.slice(0, 25) });
      },

      reset: () => set({
        xp: 0,
        completed: [],
        unlocked: initialUnlocked,
        hintUsed: [],
        writeups: {},
        username: '',
        leaderboard: [],
      })
    }),
    { name: 'hacklab-store' }
  )
);

export function rankForCompleted(count: number): string {
  if (count >= 20) return 'Domain Admin';
  if (count >= 15) return 'Red Team Lead';
  if (count >= 10) return 'Senior Pentester';
  if (count >= 5) return 'Pentester';
  if (count >= 2) return 'Script Kiddie';
  return 'Noob';
}
