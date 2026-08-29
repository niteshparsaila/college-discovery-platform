'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function goTo(target: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(target));
    router.push(`/?${params.toString()}`);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-2 text-sm">
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className="focus-ring rounded-card border border-line px-3 py-1.5 disabled:opacity-40"
      >
        Previous
      </button>
      <span className="px-2 text-navy-400">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className="focus-ring rounded-card border border-line px-3 py-1.5 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
