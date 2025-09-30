"use client";

import { useState } from "react";

import { api } from "@/trpc/react";

// Types for component props
interface CTANewsletterCompactProps {
  title?: string;
  description?: string;
  buttonText?: string;
  placeholder?: string;
  privacyText?: string;
  theme?: "swipestats" | "getdates";
  className?: string;
}

// Compact newsletter CTA for mid-article placement - minimal and non-intrusive
export const CTANewsletterCompact = ({
  title = "💡 Expert Dating Insights",
  description = "Join thousands getting insider data and optimization tips from our SwipeStats dating experts.",
  buttonText = "Join SwipeStats Community",
  placeholder = "your@email.com",
  privacyText = "No spam. Unsubscribe anytime.",
  theme = "swipestats",
  className = "",
}: CTANewsletterCompactProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Theme-based styling adapted for SwipeStats
  const themeStyles = {
    swipestats: {
      container:
        "bg-gradient-to-r from-white via-gray-50 to-white border border-rose-200/60 rounded-2xl backdrop-blur-sm shadow-lg relative overflow-hidden",
      title: "text-gray-900 font-bold",
      description: "text-gray-600",
      button:
        "bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white border-none font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 rounded-lg",
      input:
        "bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30 transition-all duration-200 focus:outline-none rounded-lg",
      accent: "text-rose-600",
      icon: "text-rose-600",
      glow: "absolute inset-0 bg-gradient-to-r from-rose-600/5 via-transparent to-rose-600/5 pointer-events-none",
      successBg: "bg-gradient-to-r from-rose-600 to-rose-700",
      successIcon: "bg-gradient-to-br from-rose-600 to-rose-700",
    },
    getdates: {
      container:
        "bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 border border-yellow-400/20 rounded-2xl backdrop-blur-sm shadow-lg relative overflow-hidden",
      title: "text-white font-bold",
      description: "text-gray-300",
      button:
        "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black border-none font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 rounded-lg",
      input:
        "bg-gray-900/80 border border-gray-600/50 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 backdrop-blur-sm transition-all duration-200 focus:outline-none rounded-lg",
      accent: "text-yellow-400",
      icon: "text-yellow-400",
      glow: "absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-transparent to-yellow-400/5 pointer-events-none",
      successBg: "bg-gradient-to-r from-yellow-400 to-yellow-500",
      successIcon: "bg-gradient-to-br from-yellow-400 to-yellow-500",
    },
  };

  const styles = themeStyles[theme];

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
      <div
        className={`my-6 ${styles.container} ${className} mx-auto w-full max-w-3xl`}
      >
        <div className="flex items-center justify-center gap-3 p-4">
          <div
            className={`h-6 w-6 rounded-full ${styles.successIcon} flex items-center justify-center`}
          >
            <svg
              className={`h-4 w-4 ${theme === "swipestats" ? "text-white" : "text-black"}`}
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
    <div
      className={`my-6 ${styles.container} ${className} mx-auto w-full max-w-3xl`}
    >
      {/* Subtle background glow */}
      <div className={styles.glow}></div>

      <div className="relative z-10 px-6 pb-8 pt-8">
        {/* Title */}
        <div className="mb-4 flex flex-col items-center justify-center text-center">
          <h3
            className={`text-3xl ${styles.title} mb-2.5 text-center leading-tight`}
            style={{ margin: "0", lineHeight: 1.1 }}
          >
            {title}
          </h3>
          <p className={`text-base ${styles.description} leading-relaxed`}>
            {description}
          </p>
        </div>

        {/* Email form */}
        <form
          onSubmit={handleEmailSubmit}
          className="flex flex-col items-center gap-4"
        >
          <input
            type="email"
            placeholder={placeholder}
            className={`w-full px-4 py-3 text-sm ${styles.input}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={newsletterMutation.isPending}
          />
          <button
            type="submit"
            disabled={newsletterMutation.isPending}
            className={`px-6 py-3 text-sm font-bold ${styles.button} ${
              newsletterMutation.isPending ? "opacity-50" : ""
            } whitespace-nowrap`}
          >
            {newsletterMutation.isPending ? "Subscribing..." : buttonText}
          </button>
        </form>

        {/* Privacy note */}
        <p
          className={`mt-4 text-center text-xs opacity-60 ${theme === "swipestats" ? "text-gray-500" : "text-gray-400"}`}
        >
          {privacyText}
        </p>
      </div>
    </div>
  );
};
