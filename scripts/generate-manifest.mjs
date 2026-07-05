// Scans the photos folder and generates public/manifest.json.
//
// Unlike the old approach (compute filenames from a padded number + total
// count in images.json), this makes NO assumption about filenames at all —
// drop in a whole folder of photos with whatever names your camera/export
// tool gave them, rerun this script (or just `npm run dev` / `npm run
// build`, which do it for you), and the gallery picks them up.
//
// Usage:
//   node scripts/generate-manifest.mjs
//   GALLERY_PHOTOS_DIR=raw-photos node scripts/generate-manifest.mjs
//   GALLERY_BASE_URL=https://cdn.example.com/wedding/ node scripts/generate-manifest.mjs

import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { imageSize } from "image-size";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "..", "public");

const PHOTOS_DIR_NAME = process.env.GALLERY_PHOTOS_DIR || "webp";
const photosDir = path.join(publicDir, PHOTOS_DIR_NAME);

// Trailing slash always enforced so `${baseUrl}${filename}` composes cleanly.
const rawBaseUrl = process.env.GALLERY_BASE_URL || `/${PHOTOS_DIR_NAME}/`;
const BASE_URL = rawBaseUrl.endsWith("/") ? rawBaseUrl : `${rawBaseUrl}/`;

const SUPPORTED_EXTENSIONS = new Set([".webp", ".jpg", ".jpeg", ".png", ".avif"]);

/**
 * Natural sort: "photo2.webp" before "photo10.webp", not after (a plain
 * string sort would put "10" before "2"). This keeps whatever numbering
 * scheme is embedded in real-world filenames (camera exports, batch
 * renames, etc.) in a sensible order without requiring a specific format.
 */
function naturalCompare(a, b) {
  const chunk = (s) => s.match(/(\d+|\D+)/g) || [];
  const aParts = chunk(a);
  const bParts = chunk(b);
  const len = Math.max(aParts.length, bParts.length);

  for (let i = 0; i < len; i++) {
    const aPart = aParts[i] ?? "";
    const bPart = bParts[i] ?? "";
    const aNum = Number(aPart);
    const bNum = Number(bPart);

    if (!Number.isNaN(aNum) && !Number.isNaN(bNum) && aPart !== "" && bPart !== "") {
      if (aNum !== bNum) return aNum - bNum;
    } else if (aPart !== bPart) {
      return aPart < bPart ? -1 : 1;
    }
  }

  return 0;
}

function listImageFiles(dir) {
  return readdirSync(dir)
    .filter((name) => {
      const full = path.join(dir, name);
      if (!statSync(full).isFile()) return false;
      return SUPPORTED_EXTENSIONS.has(path.extname(name).toLowerCase());
    })
    .sort(naturalCompare);
}

function buildManifest() {
  if (!existsSync(photosDir)) {
    console.warn(
      `⚠️  Photos folder not found at "${path.relative(publicDir, photosDir)}". ` +
        `Create it and add your photos, then rerun this script. Writing an empty manifest for now.`
    );
    return { generatedAt: new Date().toISOString(), total: 0, images: [] };
  }

  const files = listImageFiles(photosDir);

  if (files.length === 0) {
    console.warn(`⚠️  No supported image files found in "${PHOTOS_DIR_NAME}/". Manifest is empty.`);
  }

  const images = [];
  let skipped = 0;

  files.forEach((filename, i) => {
    const id = i + 1;
    const fullPath = path.join(photosDir, filename);
    let width;
    let height;

    try {
      const dimensions = imageSize(readFileSync(fullPath));
      width = dimensions.width;
      height = dimensions.height;
    } catch (err) {
      skipped++;
      console.warn(`  ↳ couldn't read dimensions for "${filename}" (${err.message}) — continuing anyway.`);
    }

    images.push({
      id,
      filename,
      src: `${BASE_URL}${encodeURIComponent(filename)}`,
      alt: `Wedding photo ${id}`,
      width,
      height,
    });
  });

  if (skipped > 0) {
    console.warn(`⚠️  ${skipped} file(s) had unreadable dimensions but were still included.`);
  }

  return { generatedAt: new Date().toISOString(), total: images.length, images };
}

function main() {
  const manifest = buildManifest();
  writeFileSync(path.join(publicDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(
    `✓ manifest.json generated with ${manifest.total} photo(s) from "${PHOTOS_DIR_NAME}/" ` +
      `(base URL: ${BASE_URL})`
  );
}

main();
