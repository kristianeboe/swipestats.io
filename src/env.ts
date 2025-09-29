import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

export const env = createEnv({
  extends: [vercel()],
  shared: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    SLACK_WEBHOOK_INTERNAL: z.string().url(),
    SLACK_WEBHOOK_INTERNAL_AI_MESSAGES: z.string().url(),
    SLACK_WEBHOOK_INTERNAL_DEVELOPER: z.string().url(),
    SLACK_WEBHOOK_INTERNAL_SALES: z.string().url(),
    SLACK_WEBHOOK_INTERNAL_RICH_MESSAGE_TEST: z.string().url(),

    PRISMIC_MASTER_TOKEN: z.string(),

    GOOGLE_DRIVE_SERVICE_ACCOUNT_PRIVATE_KEY: z.string(),
    AI_PHOTOS_PROVIDER_EMAIL: z.string().email(),
    LEMONSQUEEZY_API_KEY: z.string(),
    LEMONSQUEEZY_WEBHOOK_SECRET: z.string(),
    RESEND_API_KEY: z.string(),

    SENTRY_AUTH_TOKEN: z.string(),

    OPENAI_API_KEY: z.string().optional(),
    DEEPSEEK_API_KEY: z.string().optional(),
    OPEN_PANEL_SECRET: z.string(),
    ADMIN_PASSWORD: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url().default("https://swipestats.io"),
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
    NEXT_PUBLIC_OPEN_PANEL_CLIENT_ID: z.string(),

    NEXT_PUBLIC_IS_DEV: z.boolean(),
    NEXT_PUBLIC_IS_PROD: z.boolean(),
    NEXT_PUBLIC_MANUAL_ENV: z.enum(["development", "staging", "production"]),
  },

  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_OPEN_PANEL_CLIENT_ID:
      process.env.NEXT_PUBLIC_OPEN_PANEL_CLIENT_ID,
    NEXT_PUBLIC_MANUAL_ENV: process.env.NEXT_PUBLIC_MANUAL_ENV,
    NEXT_PUBLIC_IS_DEV: process.env.NODE_ENV === "development",
    NEXT_PUBLIC_IS_PROD: process.env.NEXT_PUBLIC_MANUAL_ENV === "production",
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
