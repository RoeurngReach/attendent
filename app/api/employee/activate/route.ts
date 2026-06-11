import { NextResponse } from 'next/server';
import { globalDb, getOrgId } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const org_id = getOrgId(req);
    const { employeeCode, telegramId } = await req.json();

    const employee = globalDb[employeeCode];

    if (!employee || employee.org_id !== org_id) {
      return NextResponse.json({ success: false, error: 'Invalid Employee Code' }, { status: 404 });
    }

    if (telegramId) {
      employee.telegram_id = telegramId;
    }

    return NextResponse.json({ success: true, employee: { ...employee, code: employeeCode } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
