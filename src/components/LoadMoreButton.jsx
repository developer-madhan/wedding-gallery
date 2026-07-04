import { memo } from "react";

function LoadMoreButton({ onClick, remaining, batchSize }) {
  const nextCount = Math.min(batchSize, remaining);

  return (
    <div className="flex justify-center py-10">
      <button
        type="button"
        onClick={onClick}
        className="rounded-xl bg-rose-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
      >
        Load {nextCount} more photo{nextCount !== 1 ? "s" : ""}
        <span className="ml-1.5 font-normal text-rose-100">({remaining} left)</span>
      </button>
    </div>
  );
}

export default memo(LoadMoreButton);
