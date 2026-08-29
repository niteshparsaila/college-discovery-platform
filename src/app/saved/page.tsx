'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CollegeCard from '@/components/CollegeCard';
import type { CollegeListItem } from '@/types';

export default function SavedPage() {
  const { status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<CollegeListItem[] | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated') {
      fetch('/api/saved')
        .then((r) => r.json())
        .then((data) => setItems(data.items ?? []));
    }
  }, [status, router]);

  if (status === 'loading' || items === null) {
    return <p className="text-navy-400">Loading your saved colleges…</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-navy-900">Saved colleges</h1>
      <p className="mt-1 text-navy-400">{items.length} colleges saved</p>

      {items.length === 0 ? (
        <div className="mt-6 rounded-card border border-dashed border-line bg-white p-10 text-center text-navy-400">
          You haven&apos;t saved any colleges yet. Save one from the Discover page.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      )}
    </div>
  );
}
