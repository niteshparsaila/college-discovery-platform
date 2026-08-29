'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import type { CollegeListItem } from '@/types';

function formatFees(fees: number) {
  return `₹${(fees / 100000).toFixed(1)}L / yr`;
}

export default function CollegeCard({
  college,
  compareSelected,
  onToggleCompare
}: {
  college: CollegeListItem;
  compareSelected?: boolean;
  onToggleCompare?: (id: string) => void;
}) {
  const { status } = useSession();
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  async function toggleSave() {
    if (status !== 'authenticated' || pending) return;
    setPending(true);
    try {
      if (saved) {
        await fetch(`/api/saved?collegeId=${college.id}`, { method: 'DELETE' });
        setSaved(false);
      } else {
        await fetch('/api/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collegeId: college.id })
        });
        setSaved(true);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="group flex flex-col justify-between rounded-card border border-line bg-white p-5 transition hover:border-navy-400">
      <div>
        <div className="flex items-start justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-card font-display text-sm text-white"
            style={{ backgroundColor: college.logoColor }}
            aria-hidden
          >
            {college.name.slice(0, 2).toUpperCase()}
          </div>
          <span className="rounded-card bg-navy-50 px-2 py-1 text-xs text-navy-800">
            {college.ownershipType}
          </span>
        </div>

        <Link href={`/colleges/${college.slug}`} className="focus-ring mt-3 block">
          <h3 className="font-display text-lg leading-snug text-navy-900 group-hover:underline">
            {college.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-navy-400">
          {college.city}, {college.state}
        </p>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-medium text-ink">{formatFees(college.feesPerYear)}</span>
          <span className="flex items-center gap-1 text-amber-600">
            ★ {college.rating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {onToggleCompare && (
          <button
            onClick={() => onToggleCompare(college.id)}
            className={`focus-ring flex-1 rounded-card border px-3 py-1.5 text-sm ${
              compareSelected
                ? 'border-navy-800 bg-navy-800 text-paper'
                : 'border-navy-600 text-navy-800 hover:bg-navy-50'
            }`}
          >
            {compareSelected ? 'Added to compare' : 'Add to compare'}
          </button>
        )}
        {status === 'authenticated' && (
          <button
            onClick={toggleSave}
            disabled={pending}
            className="focus-ring rounded-card border border-line px-3 py-1.5 text-sm text-navy-800 hover:bg-navy-50 disabled:opacity-50"
          >
            {saved ? 'Saved ✓' : 'Save'}
          </button>
        )}
      </div>
    </div>
  );
}
