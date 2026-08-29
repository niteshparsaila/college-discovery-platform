'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CollegeCard from '@/components/CollegeCard';
import Pagination from '@/components/Pagination';
import type { CollegeListResponse } from '@/types';

const COMPARE_KEY = 'compare-selection';

export default function ListingClient({ initialData }: { initialData: CollegeListResponse }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem(COMPARE_KEY);
    if (stored) setSelected(JSON.parse(stored));
  }, []);

  function toggleCompare(id: string) {
    setSelected((prev) => {
      let next: string[];
      if (prev.includes(id)) {
        next = prev.filter((x) => x !== id);
      } else {
        if (prev.length >= 4) {
          alert('You can compare up to 4 colleges at a time.');
          return prev;
        }
        next = [...prev, id];
      }
      sessionStorage.setItem(COMPARE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <div>
      {initialData.items.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-white p-10 text-center text-navy-400">
          No colleges match these filters. Try widening your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialData.items.map((college) => (
            <CollegeCard
              key={college.id}
              college={college}
              compareSelected={selected.includes(college.id)}
              onToggleCompare={toggleCompare}
            />
          ))}
        </div>
      )}

      <Pagination page={initialData.page} totalPages={initialData.totalPages} />

      {selected.length >= 2 && (
        <div className="fixed inset-x-0 bottom-0 border-t border-line bg-navy-900 px-6 py-3">
          <div className="mx-auto flex max-w-6xl items-center justify-between text-paper">
            <span className="text-sm">{selected.length} colleges selected for comparison</span>
            <button
              onClick={() => router.push(`/compare?ids=${selected.join(',')}`)}
              className="focus-ring rounded-card bg-amber-500 px-4 py-2 text-sm font-medium text-navy-900 hover:bg-amber-400"
            >
              Compare now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
