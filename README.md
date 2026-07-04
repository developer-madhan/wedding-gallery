# Wedding Gallery v2

A fast, searchable, accessible wedding photo gallery. Rebuilt on React 19 + Vite.

## What's new in v2

- **Virtualized grid** — `react-virtuoso`'s `VirtuosoGrid` (window-scroll mode) renders
  only the photos on screen, so the DOM stays light even at 500+ images.
- **React 19 optimizations** — `memo` with custom comparators on every list item,
  `useMemo`/`useCallback` throughout, `useDeferredValue` for non-blocking search.
- **Lazy-loaded lightbox** — `yet-another-react-lightbox` and its plugins are
  code-split via `React.lazy`/`Suspense` and only downloaded when a photo is opened.
- **Faster search** — fuzzy search over the whole collection via `fuse.js`,
  kept responsive with `useDeferredValue` (typing never blocks on filtering).
- **Better image loading** — reserved aspect-ratio boxes (no layout shift),
  `loading="lazy"`/`fetchPriority` tuned per row, skeleton placeholders, graceful
  broken-image fallback, and early prefetch of the first images.
- **SEO** — `react-helmet-async` for title/meta, Open Graph, Twitter Cards, and
  JSON-LD (`ImageGallery`) structured data; an auto-generated **image sitemap**
  (`scripts/generate-sitemap.mjs`, wired to `prebuild`) plus `robots.txt`.
- **Accessibility** — skip link, landmark regions, live-region search status,
  keyboard-operable cards, focus-visible rings, `prefers-reduced-motion` support.
- **Performance** — manual vendor chunk splitting (React/motion/virtuoso/search/
  lightbox) so unrelated deploys don't bust the vendor cache.
- **Production cleanup** — fixed a broken hook/component prop mismatch from v1,
  removed dead pagination/masonry CSS, added an `ErrorBoundary`, dropped stray
  `console.*` calls, and got the project passing `npm run lint` with zero errors.

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build (also regenerates public/sitemap.xml)
npm run preview   # preview the production build
npm run lint       # eslint
```

## Configuring photos

Photos aren't bundled — they're generated from `public/images.json`:

```json
{
  "baseUrl": "/webp/",
  "extension": "webp",
  "padding": 4,
  "total": 570
}
```

Drop your files as `public/webp/0001.webp` … `public/webp/0570.webp` (or point
`baseUrl` at a CDN/absolute URL — the app will automatically add a
`preconnect`/`dns-prefetch` hint for external hosts). Update `total` to match
your photo count and rerun the build to regenerate the sitemap.

Update the site URL/name/description in `src/components/SEO.jsx` and
`index.html`, and in `scripts/generate-sitemap.mjs`, before deploying to a new
domain.
