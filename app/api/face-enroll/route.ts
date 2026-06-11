import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId, descriptor } = await req.json();

    if (!userId || !descriptor) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Conceptually store to Supabase
    /*
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
      await supabase.from('face_enrollments').upsert({
         user_id: userId,
         descriptor: JSON.stringify(descriptor),
         updated_at: new Date().toISOString()
      });
    */

    return NextResponse.json({ success: true, message: "Face enrolled successfully in mock backend" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
