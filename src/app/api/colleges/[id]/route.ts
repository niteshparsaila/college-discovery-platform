import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/colleges/[id] — accepts either the cuid or the slug, so the detail
// page can use human-readable URLs (/colleges/iit-delhi) without a second lookup table.
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const college = await prisma.college.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
      include: {
        courses: { orderBy: { feesPerYear: 'asc' } },
        placements: { orderBy: { year: 'desc' } },
        reviews: { orderBy: { createdAt: 'desc' }, take: 20 }
      }
    });

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    return NextResponse.json(college);
  } catch (error) {
    console.error('GET /api/colleges/[id] failed', error);
    return NextResponse.json({ error: 'Failed to fetch college' }, { status: 500 });
  }
}
