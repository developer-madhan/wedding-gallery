// Generates public/sitemap.xml as an image sitemap: a single page URL that
// lists every wedding photo from public/manifest.json, so search engines
// can index and surface the photos themselves (Google Images, etc.), not
// just the page shell.
//
// Run `npm run manifest` first (or just `npm run build`, which chains
// manifest -> sitemap -> vite build automatically).

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "..", "public");
const SITE_URL = "https://wedding.madhankumarj.com";

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function resolveUrl(src) {
  return /^https?:\/\//.test(src) ? src : `${SITE_URL}${src}`;
}

function main() {
  const manifestPath = path.join(publicDir, "manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

  const imageEntries = manifest.images
    .map(
      (image) => `    <image:image>
      <image:loc>${escapeXml(resolveUrl(image.src))}</image:loc>
      <image:title>${escapeXml(image.alt)}</image:title>
    </image:image>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
${imageEntries}
  </url>
</urlset>
`;

  writeFileSync(path.join(publicDir, "sitemap.xml"), xml);
  console.log(`✓ sitemap.xml generated with ${manifest.total} image(s).`);
}

main();
