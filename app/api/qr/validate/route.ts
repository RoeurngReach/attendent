import { NextResponse } from 'next/server';
import { getOrgId, globalOrgs } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const org_id = getOrgId(req);
    const org = globalOrgs[org_id] || globalOrgs['default'];
    const { secret, userId } = await req.json();

    if (!secret || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (secret !== org.qr_secret) {
      return NextResponse.json({ success: false, error: "Invalid or expired QR code" }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Office QR validated, attendance recorded." 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
