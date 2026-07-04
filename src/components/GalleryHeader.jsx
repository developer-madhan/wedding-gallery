import { memo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FiCamera, FiImage, FiSearch } from "react-icons/fi";

import SearchBar from "./SearchBar";

function GalleryHeader({
  title = "Wedding Gallery",
  subtitle = "Every picture tells part of our story.",
  searchQuery,
  onSearchChange,
  onClearSearch,
  searchPending = false,
  totalImages = 0,
  matchedImages = 0,
  searching = false,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <header className="mx-auto mb-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm"
      >
        {/* Hero */}
        <div className="bg-gradient-to-r from-rose-50 via-white to-pink-50 px-6 py-10 sm:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={reduceMotion ? false : { scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.35 }}
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100"
            >
              <FiCamera className="text-rose-600" size={28} aria-hidden="true" />
            </motion.div>

            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
              {title}
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 border-t border-neutral-200 bg-neutral-50 p-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-neutral-500">
              <FiImage size={18} aria-hidden="true" />
              <span className="text-sm font-medium">Total Photos</span>
            </div>
            <div className="text-3xl font-bold text-neutral-900">
              {totalImages.toLocaleString()}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-neutral-500">
              <FiCamera size={18} aria-hidden="true" />
              <span className="text-sm font-medium">
                {searching ? "Matching" : "Loaded"}
              </span>
            </div>
            <div className="text-3xl font-bold text-neutral-900">
              {matchedImages.toLocaleString()}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-neutral-500">
              <FiSearch size={18} aria-hidden="true" />
              <span className="text-sm font-medium">Status</span>
            </div>
            <div className="text-lg font-semibold text-neutral-900">
              {searching ? "Searching..." : "Browsing"}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="border-t border-neutral-200 bg-white p-6">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            onClear={onClearSearch}
            pending={searchPending}
            resultCount={matchedImages}
            totalCount={totalImages}
          />
        </div>
      </motion.div>
    </header>
  );
}

export default memo(GalleryHeader);
