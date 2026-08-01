import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('leaderboard_totals')
      .select('user_id, username, xp, completed, updated_at')
      .order('xp', { ascending: false })
      .order('completed', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ leaderboard: data || [] });
  } catch (err) {
    console.error('Leaderboard API error:', err);
    return NextResponse.json({ leaderboard: [] });
  }
}
