import { NextResponse } from 'next/server';
import { globalDb, getOrgId, globalOrgs } from '@/lib/db';
import crypto from 'crypto';

export async function GET(req: Request) {
  const org_id = getOrgId(req);
  const org = globalOrgs[org_id] || globalOrgs['default'];
  
  const employeesCards = Object.entries(globalDb)
    .filter(([code, data]) => data.org_id === org_id)
    .map(([code, data]) => {
       const token = crypto.createHmac('sha256', org.qr_secret).update(`SECATT-EMP:${code}`).digest('hex');
       return {
         code,
         name: data.name,
         department: data.department,
         token,
         nfc_uid: data.nfc_uid || null
       };
    });
    
  return NextResponse.json({ cards: employeesCards });
}

export async function POST(req: Request) {
  try {
    const org_id = getOrgId(req);
    const { action, code, nfc_uid } = await req.json();
    
    if (action === 'bind_nfc') {
       if (globalDb[code] && globalDb[code].org_id === org_id) {
          globalDb[code].nfc_uid = nfc_uid;
          return NextResponse.json({ success: true });
       }
       return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
