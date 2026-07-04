/**
 * ============================================
 * imageService.js
 * Wedding Gallery Image Service
 * ============================================
 *
 * Responsibilities
 *  - Load gallery configuration
 *  - Generate image URLs
 *  - Provide pagination
 *  - Search images
 *  - Prefetch upcoming images
 *
 */

let galleryConfig = null;

/**
 * Load images.json only once
 */
export async function loadGalleryConfig() {
    if (galleryConfig) {
        return galleryConfig;
    }

    const response = await fetch("/images.json");

    if (!response.ok) {
        throw new Error("Unable to load images.json");
    }

    galleryConfig = await response.json();

    return galleryConfig;
}

/**
 * Return complete image list
 */
export async function getImages() {

    const config = await loadGalleryConfig();

    return Array.from(
        { length: config.total },
        (_, index) => {

            const id = index + 1;

            return {

                id,

                number: String(id).padStart(
                    config.padding,
                    "0"
                ),

                src:
                    config.baseUrl +
                    String(id).padStart(
                        config.padding,
                        "0"
                    ) +
                    "." +
                    config.extension,

                alt: `Wedding Photo ${id}`

            };

        }
    );

}

/**
 * Total Images
 */
export async function getTotalImages() {

    const config = await loadGalleryConfig();

    return config.total;

}

/**
 * Get image by id
 */
export async function getImage(id) {

    const config = await loadGalleryConfig();

    if (id < 1 || id > config.total) {
        return null;
    }

    return {

        id,

        number: String(id).padStart(
            config.padding,
            "0"
        ),

        src:
            config.baseUrl +
            String(id).padStart(
                config.padding,
                "0"
            ) +
            "." +
            config.extension,

        alt: `Wedding Photo ${id}`

    };

}

/**
 * Pagination
 *
 * page starts from 1
 */
export async function getImagesPage(
    page = 1,
    pageSize = 30
) {

    const config = await loadGalleryConfig();

    const start = (page - 1) * pageSize + 1;

    const end = Math.min(
        start + pageSize - 1,
        config.total
    );

    const images = [];

    for (let id = start; id <= end; id++) {

        images.push({

            id,

            number: String(id).padStart(
                config.padding,
                "0"
            ),

            src:
                config.baseUrl +
                String(id).padStart(
                    config.padding,
                    "0"
                ) +
                "." +
                config.extension,

            alt: `Wedding Photo ${id}`

        });

    }

    return images;

}

/**
 * Search
 *
 * Examples
 * 1
 * 15
 * 120
 * 999
 */
export async function searchImages(query) {

    const config = await loadGalleryConfig();

    if (!query) {
        return [];
    }

    const search = query
        .toString()
        .trim();

    const results = [];

    for (let id = 1; id <= config.total; id++) {

        const number = String(id).padStart(
            config.padding,
            "0"
        );

        if (
            number.includes(search) ||
            id.toString().includes(search)
        ) {

            results.push({

                id,

                number,

                src:
                    config.baseUrl +
                    number +
                    "." +
                    config.extension,

                alt: `Wedding Photo ${id}`

            });

        }

    }

    return results;

}

/**
 * Prefetch upcoming images
 */
export function prefetchImages(images = []) {

    if (
        navigator.connection?.saveData
    ) {
        return;
    }

    images.forEach(image => {

        const img = new Image();

        img.loading = "eager";
        img.decoding = "async";
        img.src = image.src;

    });

}