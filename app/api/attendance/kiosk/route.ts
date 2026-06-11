import { NextResponse } from 'next/server';
import { globalDb, globalAttendance, getOrgId } from '@/lib/db';
import { sendTelegramNotification, ADMIN_GROUP_ID } from '@/lib/bot';

export async function POST(req: Request) {
  try {
    const org_id = getOrgId(req);
    const { nfc_uid } = await req.json();

    if (!nfc_uid) {
      return NextResponse.json({ success: false, error: 'Missing NFC UID' }, { status: 400 });
    }

    // Find employee by nfc_uid
    let foundUser: any = null;
    let foundUserId = '';
    for (const [code, emp] of Object.entries(globalDb)) {
      if (emp.org_id === org_id && emp.nfc_uid === nfc_uid) {
        foundUser = emp;
        foundUserId = code;
        break;
      }
    }

    if (!foundUser) {
      return NextResponse.json({ success: false, error: 'Unknown Card' }, { status: 404 });
    }

    // Determine IN or OUT based on today's records
    const today = new Date().toDateString();
    const todayRecords = globalAttendance.filter(
      a => a.org_id === org_id && a.userId === foundUserId && new Date(a.isoTime).toDateString() === today
    ).sort((a, b) => new Date(b.isoTime).getTime() - new Date(a.isoTime).getTime());

    // If even number of records, it's an IN. If odd, it's an OUT.
    const isCheckIn = todayRecords.length % 2 === 0;
    const actionText = isCheckIn ? 'IN' : 'OUT';
    const methodStr = `NFC Kiosk (${actionText})`;

    globalAttendance.push({
      org_id,
      id: Date.now().toString(),
      userId: foundUserId,
      name: foundUser.name,
      method: methodStr,
      isoTime: new Date().toISOString(),
      timestamp: 'Just now'
    });

    if (foundUser.telegram_id) {
       const text = `🕒 <b>Kiosk ${actionText}</b>\n\n<b>Name:</b> ${foundUser.name}\n<b>Time:</b> ${new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Phnom_Penh' })}`;
       try {
         await sendTelegramNotification(foundUser.telegram_id, text);
       } catch (err) {}
    }

    return NextResponse.json({ 
      success: true, 
      action: actionText, 
      employee: {
         name: foundUser.name,
         code: foundUserId
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
