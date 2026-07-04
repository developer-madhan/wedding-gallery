import { memo } from "react";
import { FiSearch } from "react-icons/fi";

function EmptyState({ query, onClear }) {
  return (
    <div
      role="status"
      className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-20 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
        <FiSearch className="text-neutral-400" size={24} aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold text-neutral-900">No photos found</h2>
      <p className="text-sm text-neutral-500">
        We couldn&apos;t find any photos matching &ldquo;{query}&rdquo;. Try a different photo
        number.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
      >
        Clear search
      </button>
    </div>
  );
}

export default memo(EmptyState);
