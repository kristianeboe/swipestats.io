"use client";

import { useState } from "react";

import { api } from "@/trpc/react";

// Types for component props
interface CtaNewsletterProps {
  title?: string;
  description?: string;
  buttonText?: string;
  placeholder?: string;
  privacyText?: string;
  className?: string;
}

// Bar Chart Icon Component
const BarChartIcon = () => (
  <div className="flex h-8 items-end gap-1">
    <div className="h-6 w-2 rounded-sm bg-gradient-to-t from-rose-600 to-rose-400"></div>
    <div className="h-8 w-2 rounded-sm bg-gradient-to-t from-blue-600 to-blue-400"></div>
    <div className="h-5 w-2 rounded-sm bg-gradient-to-t from-green-600 to-green-400"></div>
  </div>
);

/**
 * CtaNewsletter - Propless newsletter signup CTA
 *
 * Use this component without props in blog posts for newsletter signups.
 * Optimized for mid-article placement with proven copy.
 *
 * @example
 * <CtaNewsletter />
 */
export const CtaNewsletter = ({
  title = "Get Expert Dating Insights",
  description = "Join thousands getting insider data and proven strategies to improve your dating profile. Free tips delivered to your inbox.",
  buttonText = "Get Free Tips",
  placeholder = "your@email.com",
  privacyText = "No spam. Unsubscribe anytime.",
  className = "",
}: CtaNewsletterProps = {}) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // SwipeStats styling
  const styles = {
    container:
      "bg-gradient-to-br from-rose-50/80 via-white to-rose-50/80 border border-rose-200/50 rounded-3xl backdrop-blur-sm shadow-xl relative overflow-hidden",
    title: "text-gray-900 font-bold tracking-tight",
    description: "text-gray-600 leading-relaxed",
    button:
      "bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-700 hover:via-rose-600 hover:to-rose-700 text-white border-none font-bold shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 rounded-xl px-8 py-3.5",
    input:
      "bg-white/90 border border-rose-200/60 text-gray-900 placeholder-gray-500 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 focus:bg-white transition-all duration-300 focus:outline-none rounded-xl px-5 py-3.5 backdrop-blur-sm",
    accent: "text-rose-600",
    icon: "text-rose-600",
    glow: "absolute inset-0 bg-gradient-to-r from-rose-600/8 via-transparent to-rose-600/8 pointer-events-none",
    successBg: "bg-gradient-to-r from-rose-600 to-rose-700",
    successIcon: "bg-gradient-to-br from-rose-600 to-rose-700",
  };

  // Use SwipeStats' existing tRPC newsletter system
  const newsletterMutation = api.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      setEmail("");
    },
    onError: (error) => {
      console.error("Newsletter signup failed:", error);
      // Still show success for better UX, but log error
      setIsSubmitted(true);
    },
  });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    newsletterMutation.mutate({ email });
  };

  // Success state - eye-catching and celebratory
  if (isSubmitted) {
    return (
      <div className={`my-6 ${styles.container} ${className} mx-auto w-full`}>
        <div className="flex items-center justify-center gap-3 p-4">
          <div
            className={`h-6 w-6 rounded-full ${styles.successIcon} flex items-center justify-center`}
          >
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span className={`text-sm font-bold ${styles.title}`}>
            Subscribed! Check your email 🎉
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`my-8 ${styles.container} ${className} mx-auto w-full`}>
      {/* Subtle background glow */}
      <div className={styles.glow}></div>

      <div className="relative z-10 px-8 pb-8 pt-10">
        {/* Title with Icon */}
        <div className="mb-6 flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex items-center gap-3">
            <BarChartIcon />
            <h3
              className={`text-2xl sm:text-3xl ${styles.title} leading-tight`}
              style={{ margin: "0", lineHeight: 1.1 }}
            >
              {title}
            </h3>
          </div>
          <p className={`text-base ${styles.description} max-w-lg`}>
            {description}
          </p>
        </div>

        {/* Email form */}
        <form
          onSubmit={handleEmailSubmit}
          className="mx-auto flex max-w-lg flex-col items-stretch gap-4 sm:flex-row sm:items-center"
        >
          <input
            type="email"
            placeholder={placeholder}
            className={`flex-1 text-sm ${styles.input}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={newsletterMutation.isPending}
          />
          <button
            type="submit"
            disabled={newsletterMutation.isPending}
            className={`text-sm ${styles.button} ${
              newsletterMutation.isPending ? "opacity-50" : ""
            } whitespace-nowrap sm:flex-shrink-0`}
          >
            {newsletterMutation.isPending ? "Subscribing..." : buttonText}
          </button>
        </form>

        {/* Privacy note */}
        <p className="mt-5 text-center text-xs text-gray-500 opacity-70">
          {privacyText}
        </p>
      </div>
    </div>
  );
};
