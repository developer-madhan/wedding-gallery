import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

import useGallery from "../hooks/useGallery";

import GalleryHeader from "./GalleryHeader";
import SearchBar from "./SearchBar";
import ImageCard from "./ImageCard";
import LoadingSkeleton from "./LoadingSkeleton";
import LightboxViewer from "./LightboxViewer";

export default function Gallery() {
    const {
        images,
        loading,
        loadingMore,
        error,
        hasMore,
        loadMore,
        performSearch,
        clearSearch,
        search,
        displayedCount,
        config,
    } = useGallery();

    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const observerRef = useRef(null);

    useEffect(() => {
        if (!observerRef.current) return;

        const target = observerRef.current;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    loadMore();
                }
            },
            {
                rootMargin: "800px",
                threshold: 0,
            }
        );

        requestAnimationFrame(() => {
            observer.observe(target);
        });

        return () => observer.disconnect();
    }, [hasMore, loadingMore, loadMore]);

    const openViewer = (index) => {
        setCurrentIndex(index);
        setOpen(true);
    };

    if (loading) {
        return <LoadingSkeleton count={12} />;
    }

    if (error) {
        return (
            <div className="container py-5 text-center">
                <h2>Something went wrong</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <>
            <GalleryHeader
                title={config?.title}
                loaded={displayedCount}
                total={config?.total ?? 0}
            />

            <SearchBar
                value={search}
                onSearch={performSearch}
                onClear={clearSearch}
            />

            <div className="gallery masonry-grid">
                {images.map((image, index) => (
                    <motion.div
                        key={image.id}
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        <ImageCard
                            image={image}
                            index={index}
                            onClick={() => openViewer(index)}
                        />
                    </motion.div>
                ))}
            </div>

            {loadingMore && <LoadingSkeleton count={6} compact />}

            <div ref={observerRef} style={{ height: 40 }} />

            {!hasMore && (
                <div className="text-center py-4">
                    <strong>All photos loaded</strong>
                </div>
            )}

            <LightboxViewer
                open={open}
                index={currentIndex}
                images={images}
                onClose={() => setOpen(false)}
            />
        </>
    );
}