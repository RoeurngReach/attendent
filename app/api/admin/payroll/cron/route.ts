import { NextResponse } from 'next/server';
import { globalDb } from '@/lib/db';
import { sendTelegramNotification } from '@/lib/bot';

export async function GET(req: Request) {
  // Simple check to prevent general unauthorized access (Vercel sets special headers for cron)
  // if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }
  
  try {
    const keys = Object.keys(globalDb);
    for (const code of keys) {
      const emp = globalDb[code];
      if (emp.telegram_id && emp.active !== false) {
        const baseSalary = emp.payrollType === 'fixed' ? emp.rate : (emp.rate * 160); 
        const text = `🎉 <b>Payday!</b>\n\n<b>Name:</b> ${emp.name}\n<b>Type:</b> ${emp.payrollType}\nYour monthly payment of <b>$${baseSalary}</b> has been processed.\n\nThank you for your hard work!`;
        try {
          await sendTelegramNotification(emp.telegram_id, text);
        } catch(e) {
          console.error('Failed sending cron to', emp.telegram_id);
        }
      }
    }
    return NextResponse.json({ success: true, message: 'Cron payday processed' });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
