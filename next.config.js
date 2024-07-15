/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
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
};

export default config;
