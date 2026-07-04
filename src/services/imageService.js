// src/services/imageService.js
// Client-side "database" for the gallery. Images are generated deterministically
// from a small JSON config (baseUrl/extension/padding/total) so we never have to
// ship or fetch a manifest of 570 entries.

const CONFIG_URL = "/images.json";
const REQUIRED_KEYS = ["baseUrl", "extension", "padding", "total"];

let configCache = null;
let configPromise = null;

function validateConfig(config) {
  if (!config || typeof config !== "object") {
    throw new Error("Invalid images.json");
  }

  for (const key of REQUIRED_KEYS) {
    if (!(key in config)) {
      throw new Error(`Missing "${key}" in images.json`);
    }
  }

  if (!(config.total > 0)) {
    throw new Error("Total images must be greater than zero.");
  }

  return config;
}

/**
 * Fetch + cache the gallery configuration. In-flight requests are shared so
 * concurrent callers (e.g. StrictMode double-invoke) never issue duplicate
 * network requests.
 */
export async function getGalleryConfig(forceRefresh = false) {
  if (configCache && !forceRefresh) return configCache;

  if (!configPromise || forceRefresh) {
    configPromise = fetch(CONFIG_URL, { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load images.json");
        return response.json();
      })
      .then((json) => {
        configCache = validateConfig(json);
        return configCache;
      })
      .catch((err) => {
        configPromise = null;
        throw err;
      });
  }

  return configPromise;
}

/** Zero-pad image numbers. Example: 1 -> 0001 */
export function padNumber(number, padding) {
  return String(number).padStart(padding, "0");
}

export function getImageUrl(id, config) {
  const file = padNumber(id, config.padding);
  return `${config.baseUrl}${file}.${config.extension}`;
}

export function createImage(id, config) {
  const filename = `${padNumber(id, config.padding)}.${config.extension}`;
  return {
    id,
    index: id - 1,
    filename,
    src: getImageUrl(id, config),
    alt: `Wedding photo ${id} of ${config.total}`,
  };
}

/**
 * Build the full, flat list of images from config. This is a pure, cheap
 * computation (no network) so it's safe to memoize on the config reference
 * and hand the whole array straight to the virtualizer.
 */
export function buildImageList(config) {
  return Array.from({ length: config.total }, (_, i) => createImage(i + 1, config));
}

/** Warm the browser's image cache for the first N images. */
export function prefetchImages(images = [], limit = 12) {
  if (!Array.isArray(images) || typeof window === "undefined") return;

  const count = Math.min(images.length, limit);
  for (let i = 0; i < count; i++) {
    const img = new window.Image();
    img.decoding = "async";
    img.src = images[i].src;
  }
}

export function clearGalleryCache() {
  configCache = null;
  configPromise = null;
}
