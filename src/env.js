import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
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
    PRISMIC_MASTER_TOKEN: z.string(),

    GOOGLE_DRIVE_SERVICE_ACCOUNT_PRIVATE_KEY: z.string(),
    AI_PHOTOS_PROVIDER_EMAIL: z.string().email(),
    LEMONSQUEEZY_API_KEY: z.string(),
    LEMONSQUEEZY_WEBHOOK_SECRET: z.string(),
    RESEND_API_KEY: z.string(),

    SENTRY_AUTH_TOKEN: z.string(),

    OPENAI_API_KEY: z.string(),
    DEEPSEEK_API_KEY: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url().default("https://swipestats.io"),
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),

    NEXT_PUBLIC_IS_DEV: z.boolean(),
    NEXT_PUBLIC_IS_PROD: z.boolean(),
    NEXT_PUBLIC_MANUAL_ENV: z.enum(["development", "staging", "production"]),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,

    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,

    NEXT_PUBLIC_MANUAL_ENV: process.env.NEXT_PUBLIC_MANUAL_ENV,
    NEXT_PUBLIC_IS_DEV: process.env.NODE_ENV === "development",
    NEXT_PUBLIC_IS_PROD: process.env.NEXT_PUBLIC_MANUAL_ENV === "production",

    SLACK_WEBHOOK_INTERNAL: process.env.SLACK_WEBHOOK_INTERNAL,
    SLACK_WEBHOOK_INTERNAL_AI_MESSAGES:
      process.env.SLACK_WEBHOOK_INTERNAL_AI_MESSAGES,
    SLACK_WEBHOOK_INTERNAL_DEVELOPER:
      process.env.SLACK_WEBHOOK_INTERNAL_DEVELOPER,
    PRISMIC_MASTER_TOKEN: process.env.PRISMIC_MASTER_TOKEN,

    GOOGLE_DRIVE_SERVICE_ACCOUNT_PRIVATE_KEY:
      process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_PRIVATE_KEY,
    AI_PHOTOS_PROVIDER_EMAIL: process.env.AI_PHOTOS_PROVIDER_EMAIL,
    LEMONSQUEEZY_API_KEY: process.env.LEMONSQUEEZY_API_KEY,
    LEMONSQUEEZY_WEBHOOK_SECRET: process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,

    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,

    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
