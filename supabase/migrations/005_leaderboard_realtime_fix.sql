-- Ensure realtime can broadcast every change on leaderboard_totals,
-- including updates, and that the table is part of the realtime publication.

-- Set full replica identity so all changed columns are included in the broadcast.
alter table public.leaderboard_totals replica identity full;

-- Ensure the realtime publication exists.
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end $$;

-- Add the table to the publication if it is not already there.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'leaderboard_totals'
  ) then
    alter publication supabase_realtime add table public.leaderboard_totals;
  end if;
end $$;
