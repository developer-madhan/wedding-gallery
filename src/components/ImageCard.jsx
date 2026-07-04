import { memo, useState, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";

function ImageCard({ image, index, priority = false, onOpen }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => {
    setFailed(true);
    setLoaded(true);
  }, []);

  const handleOpen = useCallback(() => onOpen(index), [onOpen, index]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleOpen();
      }
    },
    [handleOpen]
  );

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-100 shadow-sm"
    >
      <button
        type="button"
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        className="block h-full w-full focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-400"
        aria-label={`Open photo ${image.id} in full-screen viewer`}
      >
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-neutral-200" aria-hidden="true" />
        )}

        {failed ? (
          <div className="flex h-full w-full items-center justify-center bg-neutral-100 p-2 text-center text-xs text-neutral-500">
            Image unavailable
          </div>
        ) : (
          <img
            src={image.src}
            alt={image.alt}
            width={600}
            height={600}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "low"}
            draggable={false}
            onLoad={handleLoad}
            onError={handleError}
            className={`h-full w-full object-cover transition-all duration-300 select-none ${
              loaded ? "opacity-100" : "opacity-0"
            } group-hover:scale-105`}
          />
        )}

        <span className="pointer-events-none absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          #{image.id}
        </span>
      </button>
    </motion.article>
  );
}

// Custom comparator: only re-render when this specific image, its position,
// priority flag, or the (stable, useCallback'd) open handler actually change.
function areEqual(prev, next) {
  return (
    prev.image.id === next.image.id &&
    prev.index === next.index &&
    prev.priority === next.priority &&
    prev.onOpen === next.onOpen
  );
}

export default memo(ImageCard, areEqual);
