import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// All three methods share one auth check: every write and read here is scoped to
// `session.user.id`, so a user can only ever see or mutate their own saved list —
// there is no collegeId-only lookup path that would leak across accounts.
async function requireUserId() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  return userId ?? null;
}

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const saved = await prisma.savedCollege.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      college: {
        select: { id: true, slug: true, name: true, city: true, state: true, feesPerYear: true, rating: true, logoColor: true, ownershipType: true }
      }
    }
  });

  return NextResponse.json({ items: saved.map((s) => s.college) });
}

export async function POST(request: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { collegeId } = await request.json();
  if (!collegeId) return NextResponse.json({ error: 'collegeId is required' }, { status: 400 });

  try {
    await prisma.savedCollege.upsert({
      where: { userId_collegeId: { userId, collegeId } },
      update: {},
      create: { userId, collegeId }
    });
    return NextResponse.json({ saved: true }, { status: 201 });
  } catch (error) {
    console.error('POST /api/saved failed', error);
    return NextResponse.json({ error: 'Failed to save college' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const collegeId = request.nextUrl.searchParams.get('collegeId');
  if (!collegeId) return NextResponse.json({ error: 'collegeId is required' }, { status: 400 });

  await prisma.savedCollege.deleteMany({ where: { userId, collegeId } });
  return NextResponse.json({ saved: false });
}
