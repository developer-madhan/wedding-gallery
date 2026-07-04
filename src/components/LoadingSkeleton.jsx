import { memo } from "react";

const DEFAULT_COUNT = 12;

function SkeletonCard() {
  return (
    <div className="aspect-square animate-pulse rounded-xl bg-neutral-200" aria-hidden="true" />
  );
}

function LoadingSkeleton({ count = DEFAULT_COUNT, className = "" }) {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading gallery images"
      className={className}
    >
      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: count }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
      <span className="sr-only">Loading images…</span>
    </section>
  );
}

export default memo(LoadingSkeleton);
