import { useState, useEffect, useMemo, useCallback, useDeferredValue, useRef } from "react";
import Fuse from "fuse.js";

import { getGalleryConfig, buildImageList, prefetchImages } from "../services/imageService";

const FUSE_OPTIONS = {
  keys: ["filename", "id"],
  threshold: 0.3,
  ignoreLocation: true,
  minMatchCharLength: 1,
};

const DEFAULT_BATCH_SIZE = 60;

export default function useGallery() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  // How many photos are "revealed" in browsing mode. Keeping this separate
  // from the virtualizer means the browser only ever has this many <img>
  // tags in play at once, instead of every photo in the collection.
  const [visibleCount, setVisibleCount] = useState(DEFAULT_BATCH_SIZE);
  const isFirstLoad = useRef(true);

  // Keep the input itself perfectly responsive; defer the expensive
  // filtering work behind it. React can interrupt/restart the deferred
  // render if the person keeps typing, so the UI never feels blocked.
  const deferredQuery = useDeferredValue(searchInput);
  const searching = deferredQuery.trim().length > 0;
  const isSearchPending = searchInput !== deferredQuery;

  // Fetching config is the one true "synchronize with an external system"
  // effect, so the fetch + state updates live directly in the effect body
  // (not behind an extracted, eagerly-invoked callback).
  useEffect(() => {
    let active = true;
    const forceRefresh = !isFirstLoad.current;
    isFirstLoad.current = false;

    // Standard data-fetching-in-effect pattern (see react.dev/learn/synchronizing-with-effects#fetching-data):
    // reset local status ahead of the request, guard against stale
    // responses with the `active` flag, and clean up on unmount/re-run.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount/refresh is an intentional external sync, not derived state
    setLoading(true);
    setError(null);
    setVisibleCount(DEFAULT_BATCH_SIZE);

    getGalleryConfig(forceRefresh)
      .then((cfg) => {
        if (!active) return;
        setConfig(cfg);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Unable to load gallery.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadToken]);

  // The full collection is a pure function of config — cheap to compute,
  // and it's what search runs against (search should reach every photo,
  // not just the ones revealed so far).
  const allImages = useMemo(() => (config ? buildImageList(config) : []), [config]);

  const batchSize = config?.batchSize || DEFAULT_BATCH_SIZE;
  const hasMore = !searching && visibleCount < allImages.length;

  // Only this "browsable" slice gets handed to the grid in browsing mode.
  // react-virtuoso still virtualizes *within* it, so even a fully-expanded
  // gallery stays light — this just caps how much can be requested at once.
  const browsableImages = useMemo(
    () => allImages.slice(0, Math.min(visibleCount, allImages.length)),
    [allImages, visibleCount]
  );

  useEffect(() => {
    if (browsableImages.length) prefetchImages(browsableImages, 12);
  }, [browsableImages]);

  const fuse = useMemo(() => {
    if (!allImages.length) return null;
    return new Fuse(allImages, FUSE_OPTIONS);
  }, [allImages]);

  const images = useMemo(() => {
    if (!searching || !fuse) return browsableImages;
    return fuse.search(deferredQuery.trim()).map((result) => result.item);
  }, [searching, fuse, deferredQuery, browsableImages]);

  const setSearchQuery = useCallback((value) => setSearchInput(value), []);
  const clearSearch = useCallback(() => setSearchInput(""), []);
  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);
  const loadMore = useCallback(() => {
    setVisibleCount((count) => Math.min(count + batchSize, allImages.length));
  }, [batchSize, allImages.length]);

  return {
    images,
    totalImages: allImages.length,
    matchedImages: images.length,
    visibleCount: browsableImages.length,
    hasMore,
    loadMore,
    batchSize,
    loading,
    error,
    searchQuery: searchInput,
    searching,
    isSearchPending,
    setSearchQuery,
    clearSearch,
    refresh,
    config,
  };
}
