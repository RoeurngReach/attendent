import { NextResponse } from 'next/server';
import { globalDb, globalAttendance, getOrgId } from '@/lib/db';
import { sendTelegramNotification, ADMIN_GROUP_ID } from '@/lib/bot';

export async function POST(req: Request) {
  try {
    const org_id = getOrgId(req);
    const { userId, method, location, substituteFor } = await req.json();

    const employee = globalDb[userId];
    if (!employee || employee.org_id !== org_id) {
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }

    const timestamp = new Date().toLocaleString();
    let substituteNotice = '';
    let coveringName = '';
    
    if (substituteFor && globalDb[substituteFor] && globalDb[substituteFor].org_id === org_id) {
       coveringName = globalDb[substituteFor].name;
       substituteNotice = `\n<b>Covering for:</b> ${coveringName} (${substituteFor})`;
    }

    const messageText = `
<b>New Check-In</b> ⏱
<b>Employee:</b> ${employee.name} (${userId})
<b>Dept:</b> ${employee.department}
<b>Method:</b> ${method}
<b>Time:</b> ${timestamp}${substituteNotice}
${location ? `<b>Location:</b> ${location}` : ''}
    `;

    // 1. Send to Admin Group
    await sendTelegramNotification(ADMIN_GROUP_ID, messageText);

    // 2. Send to Employee via DM if linked
    if (employee.telegram_id) {
      await sendTelegramNotification(employee.telegram_id, `Checked in successfully!\n${messageText}`);
    }

    // Conceptually we'd log this attendance in DB here.
    globalAttendance.push({
      org_id,
      id: Date.now().toString(),
      userId,
      name: employee.name,
      method,
      substituteFor,
      isoTime: new Date().toISOString(),
      timestamp
    });

    return NextResponse.json({ success: true, message: 'Attendance recorded' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
