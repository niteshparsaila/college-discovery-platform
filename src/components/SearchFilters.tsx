'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

// Filters are encoded entirely in the URL query string (not component state that
// gets lost on refresh). This means a filtered/sorted listing view is shareable
// and bookmarkable, and the back button behaves correctly — the URL is the
// single source of truth, the API route reads directly from it.
export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(searchParams.get('q') ?? '');
  const [city, setCity] = useState(searchParams.get('city') ?? '');
  const [maxFees, setMaxFees] = useState(searchParams.get('maxFees') ?? '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') ?? '');
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'rating_desc');

  function apply() {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (city) params.set('city', city);
    if (maxFees) params.set('maxFees', maxFees);
    if (minRating) params.set('minRating', minRating);
    if (sort) params.set('sort', sort);
    params.set('page', '1');
    startTransition(() => router.push(`/?${params.toString()}`));
  }

  function reset() {
    setQ('');
    setCity('');
    setMaxFees('');
    setMinRating('');
    setSort('rating_desc');
    startTransition(() => router.push('/'));
  }

  return (
    <div className="rounded-card border border-line bg-white p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <label className="mb-1 block text-xs text-navy-400">Search by name</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            placeholder="e.g. IIT, BITS, Delhi University"
            className="focus-ring w-full rounded-card border border-line px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-navy-400">City</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            placeholder="e.g. Pune"
            className="focus-ring w-full rounded-card border border-line px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-navy-400">Max fees (₹/yr)</label>
          <input
            value={maxFees}
            onChange={(e) => setMaxFees(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            type="number"
            placeholder="e.g. 300000"
            className="focus-ring w-full rounded-card border border-line px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-navy-400">Min rating</label>
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="focus-ring w-full rounded-card border border-line px-3 py-2 text-sm"
          >
            <option value="">Any</option>
            <option value="3">3.0+</option>
            <option value="3.5">3.5+</option>
            <option value="4">4.0+</option>
            <option value="4.5">4.5+</option>
          </select>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <label className="text-navy-400">Sort</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="focus-ring rounded-card border border-line px-2 py-1.5"
          >
            <option value="rating_desc">Rating: High to low</option>
            <option value="fees_asc">Fees: Low to high</option>
            <option value="fees_desc">Fees: High to low</option>
            <option value="name_asc">Name: A to Z</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={reset}
            className="focus-ring rounded-card border border-line px-4 py-2 text-sm text-navy-400 hover:bg-navy-50"
          >
            Reset
          </button>
          <button
            onClick={apply}
            disabled={isPending}
            className="focus-ring rounded-card bg-navy-800 px-4 py-2 text-sm text-paper hover:bg-navy-900 disabled:opacity-60"
          >
            {isPending ? 'Applying…' : 'Apply filters'}
          </button>
        </div>
      </div>
    </div>
  );
}
