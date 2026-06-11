import { NextResponse } from 'next/server';
import { globalDb, globalAttendance, getOrgId } from '@/lib/db';
import { sendTelegramNotification } from '@/lib/bot';

export async function POST(req: Request) {
  try {
    const org_id = getOrgId(req);
    const { userId, action } = await req.json();

    if (!userId || !action) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    const employee = globalDb[userId];
    if (!employee || employee.org_id !== org_id) {
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }

    const methodStr = `Manual / Proxy (${action})`;

    globalAttendance.push({
      org_id,
      id: Date.now().toString(),
      userId,
      name: employee.name,
      method: methodStr,
      isoTime: new Date().toISOString(),
      timestamp: 'Just now'
    });

    if (employee.telegram_id) {
       const text = `🕒 <b>Proxy ${action}</b>\n\n<b>Name:</b> ${employee.name}\n<b>Time:</b> ${new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Phnom_Penh' })}\n<b>Method:</b> Manual (Admin/Kiosk)`;
       try {
         await sendTelegramNotification(employee.telegram_id, text);
       } catch (err) {}
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
