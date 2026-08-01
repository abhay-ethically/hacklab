import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        hack: {
          bg: 'var(--hack-bg)',
          panel: 'var(--hack-panel)',
          green: 'var(--hack-green)',
          amber: 'var(--hack-amber)',
          red: 'var(--hack-red)',
          cyan: 'var(--hack-cyan)',
          dim: 'var(--hack-dim)',
        },
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
