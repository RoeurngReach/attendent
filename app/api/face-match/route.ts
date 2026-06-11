import { NextResponse } from 'next/server';

function euclideanDistance(desc1: number[], desc2: number[]) {
  if (desc1.length !== desc2.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < desc1.length; i++) {
    const diff = desc1[i] - desc2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

export async function POST(req: Request) {
  try {
    const { descriptor, enrollments } = await req.json();

    if (!descriptor || !enrollments) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Conceptually, we would fetch enrollments from Supabase:
    // const { data } = await supabase.from('face_enrollments').select('*');
    
    // Instead we use the provided enrollments for mocking
    let bestMatch = null;
    let minDistance = Infinity;

    for (const userId in enrollments) {
       const enrolledData = enrollments[userId];
       const distance = euclideanDistance(descriptor, enrolledData.descriptor);
       if (distance < minDistance) {
         minDistance = distance;
         bestMatch = { userId, name: enrolledData.name, distance };
       }
    }

    const MATCH_THRESHOLD = 0.5;

    if (bestMatch && bestMatch.distance <= MATCH_THRESHOLD) {
       return NextResponse.json({ 
         success: true, 
         match: bestMatch, 
         message: `Matched ${bestMatch.name} with distance ${bestMatch.distance.toFixed(3)}` 
       });
    } else {
       return NextResponse.json({ 
         success: false, 
         error: "No matching face found",
         bestMatch: bestMatch ? { ...bestMatch, distance: bestMatch.distance.toFixed(3)} : null
       }, { status: 401 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
