import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// NextAuth's Credentials provider only verifies credentials — it has no built-in
// "create account" flow, so registration is a plain REST endpoint that NextAuth
// (via authorize()) reads from afterwards. Validation with zod happens before
// any DB hit; passwords are hashed with bcrypt and never stored or logged raw.
const signupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(72)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);

    const user = await prisma.user.create({
      data: { name: parsed.data.name.trim(), email, passwordHash },
      select: { id: true, name: true, email: true }
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('POST /api/auth/signup failed', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
