import { withSentryConfig } from "@sentry/nextjs";
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
};

// Injected content via Sentry wizard below

export default withSentryConfig(config, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "boe-ventures",
  project: "swipestats",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
