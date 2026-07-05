# Wedding Gallery v2

A fast, searchable, accessible wedding photo gallery. Rebuilt on React 19 + Vite.

## What's new in v2

- **Auto-discovered photos** — drop any folder of photos into `public/webp/`
  (any filenames, any mix of `.webp`/`.jpg`/`.jpeg`/`.png`/`.avif`, any count)
  and run `npm run manifest` (or just `npm run dev`/`npm run build`, which do
  it automatically). No more editing a `total`/padding config by hand.
- **Load more, on demand** — photos reveal in batches with a "Load more"
  button instead of everything hitting the network at once. Search still
  reaches the full collection regardless of what's been revealed so far.
- **Virtualized grid** — `react-virtuoso`'s `VirtuosoGrid` (window-scroll mode)
  renders only the photos on screen within the current batch.
- **React 19 optimizations** — `memo` with custom comparators on every list
  item, `useMemo`/`useCallback` throughout, `useDeferredValue` for
  non-blocking search.
- **Lazy-loaded lightbox** — `yet-another-react-lightbox` and its plugins are
  code-split via `React.lazy`/`Suspense` and only downloaded when a photo is
  opened.
- **Faster search** — fuzzy search over the whole collection via `fuse.js`,
  kept responsive with `useDeferredValue` (typing never blocks on filtering).
- **Better image loading** — real width/height read from each file (no layout
  shift), `loading="lazy"`/`fetchPriority` tuned per row, skeleton
  placeholders, graceful broken-image fallback, and early prefetch of the
  first images in the current batch.
- **SEO** — `react-helmet-async` for title/meta, Open Graph, Twitter Cards,
  and JSON-LD (`ImageGallery`) structured data; an auto-generated **image
  sitemap** (`scripts/generate-sitemap.mjs`, chained after the manifest on
  `prebuild`) plus `robots.txt`.
- **Accessibility** — skip link, landmark regions, live-region search status,
  keyboard-operable cards, focus-visible rings, `prefers-reduced-motion`
  support.
- **Performance** — manual vendor chunk splitting (React/motion/virtuoso/
  search/lightbox) so unrelated deploys don't bust the vendor cache.
- **Production cleanup** — fixed a broken hook/component prop mismatch from
  v1, removed dead pagination/masonry CSS, added an `ErrorBoundary`, dropped
  stray `console.*` calls, and the project passes `npm run lint` with zero
  errors.

## Getting started

```bash
npm install
npm run dev       # local dev server (auto-generates the manifest first)
npm run build     # production build (manifest -> sitemap -> vite build)
npm run preview   # preview the production build
npm run lint      # eslint
```

## Adding / changing photos

Drop your files into `public/webp/` — **any filenames, any mix of formats,
any count** — then run:

```bash
npm run manifest
```

This scans the folder and writes `public/manifest.json` with exactly what it
finds, naturally sorted (so `photo2.webp` comes before `photo10.webp`, and
arbitrary names like `reception-hall.webp` just slot in). There's nothing to
rename and nothing to count by hand — add, remove, or rename photos in the
folder and rerun the command (or just start `npm run dev` / `npm run build`,
which run it for you automatically via `predev`/`prebuild`).

Real image dimensions are read from each file and stored in the manifest, so
the grid never jumps around waiting for images to load.

`public/images.json` only holds small, optional site settings:

```json
{
  "batchSize": 60,
  "coverImage": "/cover.webp"
}
```

- `batchSize` — how many photos the "Load more" button reveals per click.
- `coverImage` — used for the Open Graph/Twitter preview image.

If your photos are hosted elsewhere (e.g. a CDN) rather than served from this
app's own `public/webp/`, point the manifest script at that instead:

```bash
GALLERY_BASE_URL=https://cdn.example.com/wedding/ npm run manifest
```

The app detects an absolute base URL automatically and adds a
`preconnect`/`dns-prefetch` hint for that origin.

> **Note:** this is a static site with no backend, so "uploading a folder"
> means copying it into `public/webp/` (on your machine or in CI) before
> building — there's no in-browser upload UI. If you'd like people to upload
> photos through the site itself, that's a bigger feature requiring a
> backend/storage service.

Update the site URL/name/description in `src/components/SEO.jsx`,
`index.html`, and `scripts/generate-sitemap.mjs` before deploying to a new
domain.
