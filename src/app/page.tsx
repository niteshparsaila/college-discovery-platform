import SearchFilters from '@/components/SearchFilters';
import ListingClient from '@/components/ListingClient';
import type { CollegeListResponse } from '@/types';
import { headers } from 'next/headers';

// This is a Server Component. It builds the same query string the client filter
// form produces and calls our own /api/colleges route server-side, so the first
// paint of the listing already has data (no client-side loading spinner on
// first visit) while all subsequent filter/page changes are handled by the
// client component below via fetch — no full page reload.
async function getColleges(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string') params.set(key, value);
  });

  const host = headers().get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/colleges?${params.toString()}`, {
    cache: 'no-store'
  });

  if (!res.ok) throw new Error('Failed to load colleges');
  return (await res.json()) as CollegeListResponse;
}

export default async function HomePage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const data = await getColleges(searchParams);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl text-navy-900">Discover your college</h1>
        <p className="mt-1 text-navy-400">
          {data.totalCount} colleges · search, filter, and shortlist for comparison
        </p>
      </div>

      <SearchFilters />

      <div className="mt-6">
        <ListingClient initialData={data} />
      </div>
    </div>
  );
}
