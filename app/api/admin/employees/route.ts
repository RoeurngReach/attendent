import { NextResponse } from 'next/server';
import { globalDb, getOrgId } from '@/lib/db';

export async function GET(req: Request) {
  const org_id = getOrgId(req);
  const employeesList = Object.entries(globalDb)
    .filter(([code, data]) => data.org_id === org_id)
    .map(([code, data]) => ({ code, ...data }));
  return NextResponse.json({ employees: employeesList });
}

export async function POST(req: Request) {
  try {
    const org_id = getOrgId(req);
    const { code, name, department, role } = await req.json();
    if (!code || !name) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    
    globalDb[code] = { org_id, name, department, role: role || 'employee', telegram_id: null, active: true };
    return NextResponse.json({ success: true, employee: { code, ...globalDb[code] } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const org_id = getOrgId(req);
    const { code, name, department, role, telegram_id, active } = await req.json();
    if (!globalDb[code] || globalDb[code].org_id !== org_id) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    globalDb[code] = { ...globalDb[code], name, department, role, telegram_id, active };
    return NextResponse.json({ success: true, employee: { code, ...globalDb[code] } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const org_id = getOrgId(req);
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    if (!code || !globalDb[code] || globalDb[code].org_id !== org_id) return NextResponse.json({ error: 'Missing code or not found' }, { status: 400 });
    
    delete globalDb[code];
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
