import type { NextConfig } from "next";

/** Old WordPress URLs that changed, so links and search results keep working. */
const legacyRedirects = [
  ["/onze-collectie", "/aanbod"],
  ["/collectie/vag-selectie", "/vag-specialist"],
  ["/collectie/bmw-selectie", "/bmw"],
  ["/collectie/premium-performance-stock", "/premium-performance"],
  ["/werkplaats/detailing-gyeon-keramische-coating", "/werkplaats/keramische-coating"],
  ["/autotransport-belgie", "/autotransport"],
  ["/product/:slug", "/aanbod/:slug"],
  ["/merk/:brand", "/aanbod"],
  ["/shop", "/aanbod"],
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.prismic.io" },
      // Only used by the local seed preview, before the content is published in Prismic.
      { protocol: "https", hostname: "bvbautomotive.be", pathname: "/wp-content/uploads/**" },
    ],
  },
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
