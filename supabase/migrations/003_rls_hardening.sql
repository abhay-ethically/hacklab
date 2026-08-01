-- Lock down leaderboard tables so users can only modify their own rows.
-- Service-role writes from the /api/score route bypass RLS by design.

-- leaderboard: users can only update/delete their own rows
-- (insert policy already exists in 002_ensure_leaderboard_tables.sql)

-- Ensure RLS is still enabled
alter table public.leaderboard enable row level security;
alter table public.leaderboard_totals enable row level security;

-- Update policy for leaderboard rows
-- Users can only read all leaderboard rows (select is already public),
-- but they can only update their own rows.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'leaderboard' and policyname = 'Users update own completion'
  ) then
    create policy "Users update own completion" on public.leaderboard
      for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'leaderboard' and policyname = 'Users delete own completion'
  ) then
    create policy "Users delete own completion" on public.leaderboard
      for delete to authenticated using (auth.uid() = user_id);
  end if;
end $$;

-- leaderboard_totals: users can only update/delete their own aggregate row
-- /api/score uses the service role key and bypasses RLS.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'leaderboard_totals' and policyname = 'Users update own total'
  ) then
    create policy "Users update own total" on public.leaderboard_totals
      for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'leaderboard_totals' and policyname = 'Users delete own total'
  ) then
    create policy "Users delete own total" on public.leaderboard_totals
      for delete to authenticated using (auth.uid() = user_id);
  end if;
end $$;
