import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getOrgId, globalOrgs } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const org_id = getOrgId(req);
    const newSecret = crypto.randomBytes(16).toString('hex');
    
    if (globalOrgs[org_id]) {
       globalOrgs[org_id].qr_secret = newSecret;
    }
    
    return NextResponse.json({ success: true, secret: newSecret });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const org_id = getOrgId(req);
  const org = globalOrgs[org_id] || globalOrgs['default'];
  return NextResponse.json({ success: true, secret: org.qr_secret });
}
