import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: rows, error: rowsError } = await admin
    .from('leaderboard')
    .select('level_id')
    .eq('user_id', session.user.id);

  if (rowsError) {
    return NextResponse.json({ error: rowsError.message }, { status: 500 });
  }

  const { data: total, error: totalError } = await admin
    .from('leaderboard_totals')
    .select('username, xp, completed')
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (totalError) {
    return NextResponse.json({ error: totalError.message }, { status: 500 });
  }

  return NextResponse.json({
    completed: rows?.map((r) => r.level_id) || [],
    xp: total?.xp || 0,
    username: total?.username || '',
  });
}
