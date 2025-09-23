"use client";

import { api } from "@/trpc/react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function NewsletterPage() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  const newsletterSubscribeMutation = api.newsletter.subscribe.useMutation();

  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
    newsletterSubscribeMutation.mutate({
      email: data.email,
    });
    setSubmitted(true);
  });

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <div className="relative isolate flex flex-col gap-3 overflow-hidden rounded-3xl border border-rose-300/80 bg-gradient-to-br from-rose-50 via-rose-100/70 to-rose-200/60 px-16 py-4 shadow-2xl sm:px-24">
          <div className="text-center text-gray-900">
            <h1 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Join Swipestats Community
            </h1>
            <p className="text-sm text-gray-700">
              Get insider data, optimization tips, and expert advice from our
              Swipestats dating experts.
            </p>
          </div>

          {submitted ? (
            <div className="text-center text-gray-900">
              <h2 className="mb-3 text-xl font-semibold">
                Thank you for subscribing! 🙌
              </h2>
              <p className="mb-4 text-sm text-gray-700">
                You&apos;ve successfully been added to our mailing list.
              </p>
              <Link
                href="/"
                className="inline-flex items-center rounded-md bg-gradient-to-r from-rose-600 to-rose-700 px-4 py-2 text-sm text-white transition-all duration-200 hover:from-rose-700 hover:to-rose-800"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <form className="w-full" onSubmit={onSubmit}>
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full rounded-md border border-gray-300 bg-white px-3.5 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30 sm:text-sm sm:leading-6"
                    placeholder="your@email.com"
                    {...form.register("email", { required: true })}
                  />
                </div>
                <button
                  type="submit"
                  disabled={newsletterSubscribeMutation.isPending}
                  className="whitespace-nowrap rounded-md bg-gradient-to-r from-rose-600 to-rose-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-rose-700 hover:to-rose-800 hover:shadow-xl disabled:opacity-50"
                >
                  {newsletterSubscribeMutation.isPending
                    ? "Subscribing..."
                    : "Join Community"}
                </button>
              </div>
              <p className="mt-4 text-center text-sm leading-6 text-gray-600">
                No spam. Unsubscribe anytime. Read our{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-rose-600 hover:text-rose-700"
                >
                  privacy policy
                </Link>
                .
              </p>
            </form>
          )}

          {/* Background decoration */}
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2"
            aria-hidden="true"
          >
            <circle
              cx="512"
              cy="512"
              r="512"
              fill="url(#lightGradient)"
              fillOpacity="0.5"
            />
            <defs>
              <radialGradient
                id="lightGradient"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(512 512) rotate(90) scale(512)"
              >
                <stop stopColor="rgb(225, 29, 72)" />
                <stop offset="1" stopColor="rgb(225, 29, 72)" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
