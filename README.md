# HackLab

A gamified, client-side Cybersecurity CTF (Capture The Flag) platform built with **Next.js 14**, **Tailwind CSS**, **xterm.js**, **Zustand**, and **Supabase**. All 25 training missions run entirely in the browser and can be deployed on Vercel without backend containers.

## Features

- 25 CTF missions across Linux recon, web exploitation, cloud, forensics, AD, and more
- In-browser pseudo-terminal powered by `@xterm/xterm`
- Simulated target web apps for SQLi, IDOR, JWT, XSS, command injection
- GitHub OAuth via Supabase Auth with server-side sessions
- Live, real-time global leaderboard using Supabase Realtime
- Step-by-step Mission / Hints / Guide / Write-up tabs
- Security headers (CSP, HSTS, X-Frame, etc.)

## Local development

```bash
cd /Users/abhayjadhav/HACKING-GAME/hacklab
npm install
npm run dev
```

## Supabase setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **Project Settings → API** and copy:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`
3. Go to **Authentication → Providers** and enable **GitHub**.
   - Add your `Client ID` and `Client Secret` from GitHub OAuth app settings.
   - Set the callback URL to `https://your-domain/auth/callback`.
4. Open the **SQL Editor** and run the contents of `supabase/migrations/001_init.sql`.
5. Copy `.env.example` to `.env.local` and fill in the three keys.

## Vercel deployment

```bash
npx vercel --prod
```

Make sure to add the same three environment variables in the Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Security notes

- Auth uses `HttpOnly` Supabase session cookies, not localStorage tokens.
- Supabase `leaderboard` and `leaderboard_totals` tables have RLS enabled.
- The server-side `/api/score` and `/api/leaderboard` routes use the `service_role` key for protected writes and global reads.
- Strict CSP and security headers are configured in `next.config.js`.
- `.env*.local` files are excluded from Git in `.gitignore`.
