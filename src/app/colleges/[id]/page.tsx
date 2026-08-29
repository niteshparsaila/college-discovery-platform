import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import type { CollegeDetail } from '@/types';

async function getCollege(id: string): Promise<CollegeDetail | null> {
  const host = headers().get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/colleges/${id}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to load college');
  return res.json();
}

function formatINR(n: number) {
  return `₹${(n / 100000).toFixed(1)}L`;
}

export default async function CollegeDetailPage({ params }: { params: { id: string } }) {
  const college = await getCollege(params.id);
  if (!college) notFound();

  const latestPlacement = college.placements[0];

  return (
    <div className="space-y-10">
      <section className="rounded-card border border-line bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-navy-900">{college.name}</h1>
            <p className="mt-1 text-navy-400">
              {college.city}, {college.state} · {college.ownershipType}
              {college.establishedIn ? ` · Est. ${college.establishedIn}` : ''}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-display text-amber-600">★ {college.rating.toFixed(1)}</div>
            <div className="text-sm text-navy-400">{formatINR(college.feesPerYear)} / yr avg fees</div>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink">{college.overview}</p>
      </section>

      <section>
        <h2 className="font-display text-xl text-navy-900">Courses offered</h2>
        <div className="mt-3 overflow-x-auto rounded-card border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-50 text-navy-800">
              <tr>
                <th className="px-4 py-2">Course</th>
                <th className="px-4 py-2">Level</th>
                <th className="px-4 py-2">Duration</th>
                <th className="px-4 py-2">Fees / yr</th>
                <th className="px-4 py-2">Seats</th>
              </tr>
            </thead>
            <tbody>
              {college.courses.map((c) => (
                <tr key={c.id} className="border-t border-line">
                  <td className="px-4 py-2 font-medium">{c.name}</td>
                  <td className="px-4 py-2">{c.degreeLevel}</td>
                  <td className="px-4 py-2">{c.durationYears} yrs</td>
                  <td className="px-4 py-2">{formatINR(c.feesPerYear)}</td>
                  <td className="px-4 py-2">{c.seats ?? '—'}</td>
                </tr>
              ))}
              {college.courses.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-navy-400">
                    No course data available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl text-navy-900">Placements</h2>
        {latestPlacement ? (
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label={`Avg (${latestPlacement.year})`} value={formatINR(latestPlacement.averagePackage)} />
            <Stat label="Median" value={formatINR(latestPlacement.medianPackage)} />
            <Stat label="Highest" value={formatINR(latestPlacement.highestPackage)} />
            <Stat label="Placement rate" value={`${latestPlacement.placementRate}%`} />
          </div>
        ) : (
          <p className="mt-3 text-navy-400">No placement data available yet.</p>
        )}
        {latestPlacement && (
          <p className="mt-3 text-sm text-navy-400">
            Top recruiters: {latestPlacement.topRecruiters}
          </p>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl text-navy-900">Student reviews</h2>
        <div className="mt-3 space-y-3">
          {college.reviews.length === 0 && (
            <p className="text-navy-400">No reviews yet. Be the first to share your experience.</p>
          )}
          {college.reviews.map((r) => (
            <div key={r.id} className="rounded-card border border-line bg-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-navy-900">{r.title}</h3>
                <span className="text-amber-600">★ {r.rating.toFixed(1)}</span>
              </div>
              <p className="mt-1 text-sm text-navy-400">
                {r.authorName}
                {r.course ? ` · ${r.course}` : ''}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink">{r.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-line bg-white p-4 text-center">
      <div className="font-display text-xl text-navy-900">{value}</div>
      <div className="text-xs text-navy-400">{label}</div>
    </div>
  );
}
