import { NextResponse } from 'next/server';
import { globalOrgs } from '@/lib/db';

export async function GET(req: Request) {
  // simple security
  const auth = req.headers.get('Authorization');
  const pwd = process.env.OWNER_PASSWORD || 'owner';
  if (auth !== `Bearer ${pwd}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // list orgs
  return NextResponse.json({ orgs: Object.values(globalOrgs) });
}

export async function POST(req: Request) {
  const auth = req.headers.get('Authorization');
  const pwd = process.env.OWNER_PASSWORD || 'owner';
  if (auth !== `Bearer ${pwd}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { action, org } = await req.json();
    if (action === 'create' || action === 'update') {
      const slug = org.slug;
      if (!slug) throw new Error('Missing slug');
      
      if (action === 'create' && globalOrgs[slug]) {
        throw new Error('Org already exists');
      }

      globalOrgs[slug] = {
        ...globalOrgs[slug],
        ...org
      };
    }
    return NextResponse.json({ success: true, orgs: Object.values(globalOrgs) });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
