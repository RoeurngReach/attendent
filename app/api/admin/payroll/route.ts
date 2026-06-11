import { NextResponse } from 'next/server';
import { globalDb, payrollConfig, globalTimesheets, globalSchedules, getOrgId } from '@/lib/db';
import { sendTelegramNotification } from '@/lib/bot';

export async function GET(req: Request) {
  const org_id = getOrgId(req);
  // Generate a mock payroll list based on the globalDb and payrollConfig
  const payrollList = Object.keys(globalDb)
    .filter(code => globalDb[code].org_id === org_id)
    .map(code => {
      const emp = globalDb[code];
      let baseSalary = 0;
      
      if (emp.payrollType === 'fixed') {
        baseSalary = emp.rate;
      } else {
        // hourly based on timesheet
        const timesheet = (globalTimesheets[org_id] && globalTimesheets[org_id][code]) || {};
        const totalHours = Object.values(timesheet).reduce((sum: number, h: any) => sum + Number(h), 0);
        baseSalary = emp.rate * Number(totalHours);
      }

      const deductions = emp.payrollType === 'fixed' ? Math.floor(Math.random() * 50) : 0;
      const adjustments = Math.floor(Math.random() * 20);
      const netPay = baseSalary - deductions + adjustments;

      return {
        userId: code,
        name: emp.name,
        payrollType: emp.payrollType,
        rate: emp.rate,
        baseSalary,
        deductions,
        adjustments,
        netPay,
        telegram_id: emp.telegram_id
      };
    });

  return NextResponse.json({
    config: payrollConfig,
    payroll: payrollList
  });
}

export async function POST(req: Request) {
  try {
    const org_id = getOrgId(req);
    const { action, userId, amount } = await req.json();
    // Conceptually we could add an adjustment or process payday here
    
    if (action === 'send_payslip') {
      const emp = globalDb[userId];
      if (emp && emp.org_id === org_id && emp.telegram_id) {
        const text = `🧾 <b>Payslip Ready</b>\n\n<b>Name:</b> ${emp.name}\n<b>Type:</b> ${emp.payrollType}\n<b>Amount:</b> $${amount}`;
        await sendTelegramNotification(emp.telegram_id, text);
        return NextResponse.json({ success: true, message: 'Payslip sent to Telegram.' });
      } else {
         return NextResponse.json({ success: false, error: 'Employee has no linked Telegram account.' });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
