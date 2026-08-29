import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/colleges?q=&city=&state=&minFees=&maxFees=&minRating=&ownershipType=&sort=&page=&pageSize=
//
// Design decisions:
// - All filtering/sorting/pagination happens in the DB via Prisma `where`/`orderBy`/
//   `skip`/`take`. Nothing is fetched-then-filtered in JS: that would break as soon as
//   the dataset stops fitting in memory, defeating the point of pagination.
// - pageSize is clamped server-side (max 50) so a client can't request the whole table
//   in one call.
// - Uses Promise.all to run the count query and the page query concurrently.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const q = params.get('q')?.trim();
  const city = params.get('city')?.trim();
  const state = params.get('state')?.trim();
  const ownershipType = params.get('ownershipType')?.trim();
  const minFees = params.get('minFees') ? Number(params.get('minFees')) : undefined;
  const maxFees = params.get('maxFees') ? Number(params.get('maxFees')) : undefined;
  const minRating = params.get('minRating') ? Number(params.get('minRating')) : undefined;
  const sort = params.get('sort') ?? 'rating_desc';

  const page = Math.max(1, Number(params.get('page') ?? 1) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(params.get('pageSize') ?? 12) || 12));

  const where: Prisma.CollegeWhereInput = {
    AND: [
      q ? { name: { contains: q, mode: 'insensitive' } } : {},
      city ? { city: { equals: city, mode: 'insensitive' } } : {},
      state ? { state: { equals: state, mode: 'insensitive' } } : {},
      ownershipType ? { ownershipType: { equals: ownershipType, mode: 'insensitive' } } : {},
      minFees !== undefined && !Number.isNaN(minFees) ? { feesPerYear: { gte: minFees } } : {},
      maxFees !== undefined && !Number.isNaN(maxFees) ? { feesPerYear: { lte: maxFees } } : {},
      minRating !== undefined && !Number.isNaN(minRating) ? { rating: { gte: minRating } } : {}
    ]
  };

  const orderBy: Prisma.CollegeOrderByWithRelationInput =
    sort === 'fees_asc'
      ? { feesPerYear: 'asc' }
      : sort === 'fees_desc'
      ? { feesPerYear: 'desc' }
      : sort === 'name_asc'
      ? { name: 'asc' }
      : { rating: 'desc' };

  try {
    const [totalCount, items] = await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          slug: true,
          name: true,
          city: true,
          state: true,
          ownershipType: true,
          feesPerYear: true,
          rating: true,
          logoColor: true
        }
      })
    ]);

    return NextResponse.json({
      items,
      page,
      pageSize,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / pageSize))
    });
  } catch (error) {
    console.error('GET /api/colleges failed', error);
    return NextResponse.json({ error: 'Failed to fetch colleges' }, { status: 500 });
  }
}
