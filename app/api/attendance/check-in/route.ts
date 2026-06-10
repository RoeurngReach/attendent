import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, unauthorizedResponse } from '@/lib/api-auth';
import { db } from '@/src/db';
import { attendanceLogs, users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  const tokenUser = await verifyAuth(req);
  if (!tokenUser) return unauthorizedResponse();

  try {
    const { method, locationLat, locationLng, imageBase64 } = await req.json();

    // Find the current db user
    const dbUserResult = await db.select().from(users).where(eq(users.uid, tokenUser.uid));
    if (!dbUserResult.length) {
      return NextResponse.json({ error: "User not found. Please sync." }, { status: 400 });
    }
    const dbUser = dbUserResult[0];

    // If face matching is used
    if (method === 'face' && imageBase64) {
      // Very simple face matching mechanism via Gemini
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          'Does this image clearly show a human face suitable for attendance check-in? Answer YES or NO.',
          { inlineData: { data: imageBase64.split(',')[1] || imageBase64, mimeType: 'image/jpeg' } }
        ]
      });
      const text = response.text?.toLowerCase() || '';
      if (!text.includes('yes')) {
         return NextResponse.json({ error: "Face not recognized clearly. Please try again." }, { status: 400 });
      }
    }

    // Insert log
    const log = await db.insert(attendanceLogs).values({
      userId: dbUser.id,
      tenantId: dbUser.tenantId,
      type: 'check_in',
      method: method || 'manual',
      locationLat: locationLat ? String(locationLat) : null,
      locationLng: locationLng ? String(locationLng) : null,
    }).returning();

    return NextResponse.json({ success: true, log: log[0] });

  } catch (err: any) {
    console.error("Checkin route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const tokenUser = await verifyAuth(req);
  if (!tokenUser) return unauthorizedResponse();

  try {
     const dbUserResult = await db.select().from(users).where(eq(users.uid, tokenUser.uid));
     if (!dbUserResult.length) return NextResponse.json([]);
     const logs = await db.select().from(attendanceLogs).where(eq(attendanceLogs.userId, dbUserResult[0].id));
     return NextResponse.json(logs);
  } catch (err: any) {
     return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
