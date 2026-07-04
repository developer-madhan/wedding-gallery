import { forwardRef, memo, useMemo } from "react";
import { VirtuosoGrid } from "react-virtuoso";

import ImageCard from "./ImageCard";

const GridList = forwardRef(function GridList({ style, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      {...props}
      style={style}
      className="grid grid-cols-2 gap-3 px-4 pb-4 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      {children}
    </div>
  );
});

const GridItem = forwardRef(function GridItem({ children, ...props }, ref) {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});

// Stable object identity so react-virtuoso doesn't tear down/recreate the
// scroller components on every Gallery render.
const gridComponents = { List: GridList, Item: GridItem };

function GalleryGrid({ images, onOpenImage }) {
  // A tiny number of "eager, high-priority" slots for the first row(s) so
  // the hero content paints fast; everything else stays lazy.
  const priorityCount = 6;

  const itemContent = useMemo(
    () => (index) => {
      const image = images[index];
      if (!image) return null;
      return (
        <ImageCard
          image={image}
          index={index}
          priority={index < priorityCount}
          onOpen={onOpenImage}
        />
      );
    },
    [images, onOpenImage]
  );

  return (
    <VirtuosoGrid
      useWindowScroll
      totalCount={images.length}
      overscan={400}
      components={gridComponents}
      itemContent={itemContent}
      computeItemKey={(index) => images[index]?.id ?? index}
    />
  );
}

// Only the images array and the (stable) open handler matter here.
function areEqual(prev, next) {
  return prev.images === next.images && prev.onOpenImage === next.onOpenImage;
}

export default memo(GalleryGrid, areEqual);
