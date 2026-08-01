import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getLevel } from '@/lib/levelData';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { levelId, flag } = body;
    const level = getLevel(levelId);

    if (!level || !flag || flag.trim() !== level.flag) {
      return NextResponse.json({ correct: false }, { status: 200 });
    }

    const admin = createAdminClient();
    const { data: existing } = await admin
      .from('leaderboard')
      .select('completed')
      .eq('user_id', user.id)
      .eq('level_id', levelId)
      .single();

    if (existing) {
      return NextResponse.json({ correct: true, already: true }, { status: 200 });
    }

    const { data: profile } = await admin
      .from('leaderboard_totals')
      .select('xp, completed')
      .eq('user_id', user.id)
      .single();

    const username =
      user.user_metadata?.user_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'Operator';

    const newXp = (profile?.xp || 0) + level.xp;
    const newCompleted = (profile?.completed || 0) + 1;

    await admin.from('leaderboard_totals').upsert(
      {
        user_id: user.id,
        username,
        xp: newXp,
        completed: newCompleted,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    await admin.from('leaderboard').insert({
      user_id: user.id,
      level_id: levelId,
      completed: true,
    });

    return NextResponse.json({ correct: true, xp: newXp, completed: newCompleted });
  } catch (err) {
    console.error('Score API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
