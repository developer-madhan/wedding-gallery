import { memo } from "react";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://wedding.madhankumarj.com";
const SITE_NAME = "Madhankumar & Jaishree Wedding Gallery";
const DESCRIPTION =
  "Browse and relive the wedding memories of Madhankumar & Jaishree — a searchable, full-resolution photo gallery.";
const COVER_IMAGE = `${SITE_URL}/cover.webp`;

function SEO({ totalImages = 0, imageBaseUrl }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: SITE_NAME,
    description: DESCRIPTION,
    url: SITE_URL,
    author: [{ "@type": "Person", name: "Madhankumar" }, { "@type": "Person", name: "Jaishree" }],
    numberOfItems: totalImages,
    image: COVER_IMAGE,
  };

  // If images are served from an external host, hint the browser to open
  // that connection early instead of waiting for the first <img> request.
  const isExternalHost = imageBaseUrl && /^https?:\/\//.test(imageBaseUrl);
  const externalOrigin = isExternalHost ? new URL(imageBaseUrl).origin : null;

  return (
    <Helmet>
      <title>{SITE_NAME}</title>
      <link rel="canonical" href={SITE_URL} />
      <meta name="description" content={DESCRIPTION} />
      <meta name="theme-color" content="#e11d48" />
      <meta name="robots" content="index, follow" />

      {externalOrigin && <link rel="preconnect" href={externalOrigin} crossOrigin="" />}
      {externalOrigin && <link rel="dns-prefetch" href={externalOrigin} />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={SITE_NAME} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:image" content={COVER_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={SITE_NAME} />
      <meta name="twitter:description" content={DESCRIPTION} />
      <meta name="twitter:image" content={COVER_IMAGE} />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}

export default memo(SEO);
