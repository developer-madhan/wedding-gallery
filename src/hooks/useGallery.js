import { useCallback, useEffect, useMemo, useState } from "react";

import {
    loadGalleryConfig,
    getImagesPage,
    searchImages,
    prefetchImages,
} from "../services/imageService";

export default function useGallery() {

    const [config, setConfig] = useState(null);

    const [images, setImages] = useState([]);

    const [filteredImages, setFilteredImages] = useState([]);

    const [loading, setLoading] = useState(true);

    const [loadingMore, setLoadingMore] = useState(false);

    const [error, setError] = useState(null);

    const [page, setPage] = useState(1);

    const [search, setSearch] = useState("");

    const [hasMore, setHasMore] = useState(true);

    /**
     * Load configuration
     */
    useEffect(() => {

        async function init() {

            try {

                const cfg = await loadGalleryConfig();

                setConfig(cfg);

            } catch (err) {

                setError(err.message);

            }

        }

        init();

    }, []);

    /**
     * First page
     */
    useEffect(() => {

        if (!config) return;

        loadFirstPage();

    }, [config]);

    /**
     * Load first page
     */
    const loadFirstPage = async () => {

        setLoading(true);

        try {

            const list = await getImagesPage(
                1,
                config.batchSize
            );

            setImages(list);

            setFilteredImages(list);

            setPage(1);

            prefetchImages(
                list.slice(0, 10)
            );

            setHasMore(
                list.length < config.total
            );

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }

    };

    /**
     * Infinite Scroll
     */
    const loadMore = useCallback(async () => {

        if (
            loadingMore ||
            !hasMore ||
            search.length
        ) {
            return;
        }

        setLoadingMore(true);

        try {

            const nextPage = page + 1;

            const nextImages =
                await getImagesPage(
                    nextPage,
                    config.batchSize
                );

            if (
                nextImages.length === 0
            ) {

                setHasMore(false);

                return;

            }

            setImages(prev => {

                const updated = [
                    ...prev,
                    ...nextImages
                ];

                setFilteredImages(updated);

                return updated;

            });

            setPage(nextPage);

            prefetchImages(
                nextImages.slice(0, 10)
            );

            if (
                nextPage *
                config.batchSize >=
                config.total
            ) {

                setHasMore(false);

            }

        } catch (err) {

            setError(err.message);

        } finally {

            setLoadingMore(false);

        }

    }, [
        page,
        loadingMore,
        hasMore,
        config,
        search,
    ]);

    /**
     * Search
     */
    const performSearch = async (
        value
    ) => {

        setSearch(value);

        if (
            value.trim() === ""
        ) {

            setFilteredImages(images);

            return;

        }

        const results =
            await searchImages(value);

        setFilteredImages(results);

    };

    /**
     * Clear Search
     */
    const clearSearch = () => {

        setSearch("");

        setFilteredImages(images);

    };

    /**
     * Total Loaded
     */
    const loadedCount = useMemo(() => {

        return images.length;

    }, [images]);

    /**
     * Total Displayed
     */
    const displayedCount = useMemo(() => {

        return filteredImages.length;

    }, [filteredImages]);

    return {

        config,

        images: filteredImages,

        allImages: images,

        loading,

        loadingMore,

        error,

        page,

        hasMore,

        search,

        loadedCount,

        displayedCount,

        loadMore,

        performSearch,

        clearSearch,

    };

}