import { NextResponse } from 'next/server';
import { globalDb, globalTimesheets, globalSchedules, getOrgId } from '@/lib/db';

export async function GET(req: Request) {
  const org_id = getOrgId(req);
  return NextResponse.json({
    timesheets: globalTimesheets[org_id] || {},
    schedules: globalSchedules[org_id] || {}
  });
}

export async function POST(req: Request) {
  try {
    const org_id = getOrgId(req);
    const { action, userId, date, hours, schedule } = await req.json();
    
    if (!globalTimesheets[org_id]) globalTimesheets[org_id] = {};
    if (!globalSchedules[org_id]) globalSchedules[org_id] = {};

    if (action === 'log_hours') {
      if (!globalTimesheets[org_id][userId]) globalTimesheets[org_id][userId] = {};
      globalTimesheets[org_id][userId][date] = Number(hours);
    } else if (action === 'set_schedule') {
      globalSchedules[org_id][userId] = schedule; // e.g. { 'Monday': 8, 'Tuesday': 4 }
    }
    
    return NextResponse.json({ success: true, timesheets: globalTimesheets[org_id], schedules: globalSchedules[org_id] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
