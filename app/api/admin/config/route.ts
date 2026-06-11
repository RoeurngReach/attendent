import { NextResponse } from 'next/server';
import { globalOrgs, getOrgId } from '@/lib/db';

export async function GET(req: Request) {
  const org_id = getOrgId(req);
  const org = globalOrgs[org_id] || globalOrgs['default'];
  
  return NextResponse.json({
    officeLocation: { lat: org.geofence.lat, lng: org.geofence.lng },
    allowedRadius: org.geofence.radius,
    methods: org.attendance_methods || {}
  });
}

export async function POST(req: Request) {
  try {
    const org_id = getOrgId(req);
    const org = globalOrgs[org_id] || globalOrgs['default'];
    const { lat, lng, radius } = await req.json();
    
    if (lat !== undefined && lng !== undefined) {
      org.geofence.lat = Number(lat);
      org.geofence.lng = Number(lng);
    }
    if (radius !== undefined) {
      org.geofence.radius = Number(radius);
    }
    return NextResponse.json({ success: true, config: { officeLocation: { lat: org.geofence.lat, lng: org.geofence.lng }, allowedRadius: org.geofence.radius } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
