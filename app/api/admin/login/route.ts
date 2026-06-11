import { NextResponse } from 'next/server';
import { getOrgId, globalOrgs } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const org_id = getOrgId(req);
    const { password } = await req.json();
    const org = globalOrgs[org_id] || globalOrgs['default'];
    if (org && org.admin_password === password) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
