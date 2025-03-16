/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        hostname: "images.prismic.io",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "miro.medium.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/insights",
        destination: "/insights/demo",
        permanent: false,
      },
      {
        source: "/insights",
        has: [
          {
            type: "query",
            key: "profileId",
            value:
              "96d5e7ba8f42af5f40b1ea25a3deafc035ebd5350521b925a5e6478e2aebfee5",
          },
        ],
        destination: "/insights/demo",
        permanent: false,
      },

      {
        source: "/research",
        destination: "/#pricing",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://eu.i.posthog.com/decide",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
