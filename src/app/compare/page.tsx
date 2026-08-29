import Link from 'next/link';
import { headers } from 'next/headers';

type ComparePlacement = {
  year: number;
  averagePackage: number;
  placementRate: number;
};

type CompareCollege = {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  feesPerYear: number;
  rating: number;
  ownershipType: string;
  placements: ComparePlacement[];
};

async function getComparison(ids: string) {
  const host = headers().get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/compare?ids=${ids}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return (res.json() as Promise<{ colleges: CompareCollege[] }>);
}

function formatINR(n: number) {
  return `₹${(n / 100000).toFixed(1)}L`;
}

const ROWS: { label: string; render: (c: CompareCollege) => string }[] = [
  { label: 'Location', render: (c) => `${c.city}, ${c.state}` },
  { label: 'Ownership', render: (c) => c.ownershipType },
  { label: 'Fees / year', render: (c) => formatINR(c.feesPerYear) },
  { label: 'Rating', render: (c) => `★ ${c.rating.toFixed(1)}` },
  {
    label: 'Avg. package (latest)',
    render: (c) => (c.placements[0] ? formatINR(c.placements[0].averagePackage) : '—')
  },
  {
    label: 'Placement rate',
    render: (c) => (c.placements[0] ? `${c.placements[0].placementRate}%` : '—')
  }
];

export default async function ComparePage({ searchParams }: { searchParams: { ids?: string } }) {
  const ids = searchParams.ids;

  if (!ids) {
    return (
      <div className="rounded-card border border-dashed border-line bg-white p-10 text-center">
        <p className="text-navy-400">
          No colleges selected. Go back to{' '}
          <Link href="/" className="text-navy-800 underline">
            Discover
          </Link>{' '}
          and add 2–4 colleges to compare.
        </p>
      </div>
    );
  }

  const data = await getComparison(ids);

  if (!data) {
    return (
      <div className="rounded-card border border-line bg-white p-10 text-center text-navy-400">
        Could not load this comparison. One of the selected colleges may no longer exist.
      </div>
    );
  }

  const { colleges } = data;

  return (
    <div>
      <h1 className="font-display text-3xl text-navy-900">Compare colleges</h1>
      <p className="mt-1 text-navy-400">Side-by-side view of {colleges.length} colleges</p>

      <div className="mt-6 overflow-x-auto rounded-card border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-navy-50 text-navy-800">
              <th className="px-4 py-3">Metric</th>
              {colleges.map((c) => (
                <th key={c.id} className="px-4 py-3">
                  <Link href={`/colleges/${c.slug}`} className="underline hover:text-navy-600">
                    {c.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-t border-line">
                <td className="px-4 py-3 font-medium text-navy-400">{row.label}</td>
                {colleges.map((c) => (
                  <td key={c.id} className="px-4 py-3">
                    {row.render(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
