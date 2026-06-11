import { NextResponse } from 'next/server';
import { globalAttendance, globalDb, getOrgId } from '@/lib/db';

export async function GET(req: Request) {
  const org_id = getOrgId(req);
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  
  // filter by org default and order by newest
  const orgFiltered = globalAttendance.filter(a => a.org_id === org_id);
  const sorted = orgFiltered.sort((a,b) => new Date(b.isoTime).getTime() - new Date(a.isoTime).getTime());
  
  const start = (page - 1) * limit;
  const end = start + limit;
  
  const items = sorted.slice(start, end);

  // Group by employee for monthly summary conceptually
  const summary = Object.keys(globalDb).filter(code => globalDb[code].org_id === org_id).map(code => {
    const emp = globalDb[code];
    const logs = sorted.filter(l => l.userId === code);
    return {
      userId: code,
      name: emp.name,
      totalDays: new Set(logs.map(l => new Date(l.isoTime).toDateString())).size,
      totalLogs: logs.length,
      // mock calculation
      lateDays: Math.floor(Math.random() * 3), 
      workHours: Math.floor(Math.random() * 160) + 40,
    };
  });
  
  return NextResponse.json({
    data: items,
    summary,
    total: sorted.length,
    page,
    limit
  });
}
