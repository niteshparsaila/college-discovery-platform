'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl tracking-tight text-navy-900">
          Prospectus
          <span className="ml-1 align-super text-xs font-body text-amber-600">MVP</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="focus-ring text-ink hover:text-navy-600">
            Discover
          </Link>
          <Link href="/compare" className="focus-ring text-ink hover:text-navy-600">
            Compare
          </Link>
          {status === 'authenticated' ? (
            <>
              <Link href="/saved" className="focus-ring text-ink hover:text-navy-600">
                Saved
              </Link>
              <span className="hidden text-navy-400 sm:inline">{session.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="focus-ring rounded-card border border-navy-600 px-3 py-1.5 text-navy-800 hover:bg-navy-50"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="focus-ring text-ink hover:text-navy-600">
                Log in
              </Link>
              <Link
                href="/signup"
                className="focus-ring rounded-card bg-navy-800 px-3 py-1.5 text-paper hover:bg-navy-900"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
