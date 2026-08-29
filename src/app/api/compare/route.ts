import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/compare?ids=id1,id2,id3
//
// Deliberately a thin, dedicated endpoint rather than reusing /api/colleges/[id]
// N times from the client: one round trip instead of N, and the server can cap
// how many colleges may be compared at once (product rule: 2-4) in one place.
export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get('ids');
  if (!idsParam) {
    return NextResponse.json({ error: 'Missing ids query param' }, { status: 400 });
  }

  const ids = Array.from(new Set(idsParam.split(',').map((s) => s.trim()).filter(Boolean)));

  if (ids.length < 2) {
    return NextResponse.json({ error: 'Provide at least 2 college ids to compare' }, { status: 400 });
  }
  if (ids.length > 4) {
    return NextResponse.json({ error: 'You can compare at most 4 colleges at once' }, { status: 400 });
  }

  try {
    const colleges = await prisma.college.findMany({
      where: { id: { in: ids } },
      include: {
        placements: { orderBy: { year: 'desc' }, take: 1 }
      }
    });

    // Preserve the order the client asked for (findMany with `in` does not guarantee it).
    const ordered = ids
      .map((id) => colleges.find((c) => c.id === id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));

    if (ordered.length !== ids.length) {
      return NextResponse.json({ error: 'One or more college ids were not found' }, { status: 404 });
    }

    return NextResponse.json({ colleges: ordered });
  } catch (error) {
    console.error('GET /api/compare failed', error);
    return NextResponse.json({ error: 'Failed to fetch comparison' }, { status: 500 });
  }
}
