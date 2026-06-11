import { NextResponse } from 'next/server';
import { globalDb, getOrgId } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const org_id = getOrgId(req);
    const { employees } = await req.json();
    for (const emp of employees) {
      if (emp.code && emp.name) {
        globalDb[emp.code] = {
           org_id,
           name: emp.name,
           department: emp.department || 'General',
           role: emp.role || 'employee',
           telegram_id: emp.telegram_id || null,
           payrollType: emp.payrollType || 'fixed',
           rate: Number(emp.rate) || 0,
           active: true
        };
      }
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
