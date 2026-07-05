import { memo } from "react";
import { FiImage } from "react-icons/fi";

function NoPhotosYet() {
  return (
    <div
      role="status"
      className="mx-auto flex max-w-lg flex-col items-center gap-3 px-4 py-20 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
        <FiImage className="text-neutral-400" size={24} aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold text-neutral-900">No photos yet</h2>
      <p className="text-sm text-neutral-500">
        Drop your photos into <code className="rounded bg-neutral-100 px-1.5 py-0.5">public/webp</code>{" "}
        (any filenames, any count) and restart <code className="rounded bg-neutral-100 px-1.5 py-0.5">npm run dev</code>{" "}
        or rebuild — the photo list regenerates automatically.
      </p>
    </div>
  );
}

export default memo(NoPhotosYet);
