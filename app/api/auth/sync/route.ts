import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, unauthorizedResponse } from '@/lib/api-auth';
import { getOrCreateUser } from '@/src/db/users';

export async function POST(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return unauthorizedResponse();

  try {
    const dbUser = await getOrCreateUser(user.uid, user.email || '', user.name || '');
    return NextResponse.json({ success: true, user: dbUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
