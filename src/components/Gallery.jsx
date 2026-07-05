import { lazy, Suspense, useCallback, useState } from "react";

import useGallery from "../hooks/useGallery";

import SEO from "./SEO";
import GalleryHeader from "./GalleryHeader";
import GalleryGrid from "./GalleryGrid";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";
import NoPhotosYet from "./NoPhotosYet";
import LoadMoreButton from "./LoadMoreButton";

// The lightbox (plus its zoom/fullscreen/download/counter plugins and CSS)
// is only needed once someone opens a photo, so it's excluded from the
// initial JS bundle entirely and fetched on demand.
const LightboxViewer = lazy(() => import("./LightboxViewer"));

export default function Gallery() {
  const {
    images,
    totalImages,
    matchedImages,
    visibleCount,
    hasMore,
    loadMore,
    batchSize,
    loading,
    error,
    searchQuery,
    searching,
    isSearchPending,
    setSearchQuery,
    clearSearch,
    refresh,
    sampleImageSrc,
  } = useGallery();

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const openViewer = useCallback((index) => {
    setViewerIndex(index);
    setViewerOpen(true);
  }, []);

  const closeViewer = useCallback(() => setViewerOpen(false), []);

  if (loading) {
    return (
      <>
        <SEO totalImages={0} />
        <a href="#gallery-main" className="skip-link">
          Skip to gallery
        </a>
        <LoadingSkeleton count={12} className="pt-10" />
      </>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h2 className="text-lg font-semibold text-neutral-900">Something went wrong</h2>
        <p className="mt-2 text-sm text-neutral-500">{error}</p>
        <button
          type="button"
          onClick={refresh}
          className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (totalImages === 0) {
    return (
      <>
        <SEO totalImages={0} />
        <NoPhotosYet />
      </>
    );
  }

  return (
    <>
      <SEO totalImages={totalImages} sampleImageSrc={sampleImageSrc} />

      <a href="#gallery-main" className="skip-link">
        Skip to gallery
      </a>

      <GalleryHeader
        title="Wedding Gallery"
        subtitle="Every picture tells part of our story."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={clearSearch}
        searchPending={isSearchPending}
        totalImages={totalImages}
        matchedImages={matchedImages}
        searching={searching}
      />

      <main id="gallery-main" aria-label="Wedding photo gallery">
        {images.length === 0 ? (
          <EmptyState query={searchQuery} onClear={clearSearch} />
        ) : (
          <>
            <GalleryGrid images={images} onOpenImage={openViewer} />
            {hasMore && (
              <LoadMoreButton
                onClick={loadMore}
                remaining={totalImages - visibleCount}
                batchSize={batchSize}
              />
            )}
          </>
        )}
      </main>

      {viewerOpen && (
        <Suspense fallback={null}>
          <LightboxViewer
            open={viewerOpen}
            index={viewerIndex}
            images={images}
            onClose={closeViewer}
          />
        </Suspense>
      )}
    </>
  );
}
