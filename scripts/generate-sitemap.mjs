// Generates public/sitemap.xml as an image sitemap: a single page URL that
// lists every wedding photo, so search engines can index and surface the
// photos themselves (Google Images, etc.), not just the page shell.
// Runs automatically before `vite build` (see package.json "prebuild").

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "..", "public");
const SITE_URL = "https://wedding.madhankumarj.com";

function padNumber(number, padding) {
  return String(number).padStart(padding, "0");
}

function main() {
  const configPath = path.join(publicDir, "images.json");
  const config = JSON.parse(readFileSync(configPath, "utf-8"));
  const { baseUrl, extension, padding, total } = config;

  const isAbsolute = /^https?:\/\//.test(baseUrl);
  const imageUrl = (id) => {
    const file = `${padNumber(id, padding)}.${extension}`;
    return isAbsolute ? `${baseUrl}${file}` : `${SITE_URL}${baseUrl}${file}`;
  };

  const imageEntries = Array.from({ length: total }, (_, i) => {
    const id = i + 1;
    return `    <image:image>
      <image:loc>${imageUrl(id)}</image:loc>
      <image:title>Wedding photo ${id}</image:title>
    </image:image>`;
  }).join("\n");

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
  console.log(`sitemap.xml generated with ${total} images.`);
}

main();
