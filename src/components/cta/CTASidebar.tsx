"use client";

import { useState } from "react";
import Link from "next/link";
import { getPrismicLinkUrl } from "@/lib/utils/prismic.utils";

// Types for component props
interface CTASidebarProps {
  title?: string;
  description?: string;
  stats?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  variant?: "swipestats" | "newsletter" | "testimonial" | "profile-generator";
  theme?: "swipestats" | "getdates";
  className?: string;
}

// Brand-adaptive sidebar CTA component for blog monetization
const CTASidebar = ({
  title = "Stop Wasting Money on Dating Apps",
  description = "Swipestats data reveals the real issue. Bad photos kill your dating prospects before you even get a chance. Get photos that actually attract matches or subscribe for expert advice and exclusive offers.",
  stats = "",
  primaryButtonText = "Learn More",
  primaryButtonLink = "/",
  secondaryButtonText,
  secondaryButtonLink,
  variant = "swipestats",
  theme = "swipestats",
  className = ""
}: CTASidebarProps) => {
  const [email, setEmail] = useState("");

  // Theme-based styling adapted for SwipeStats
  const themeStyles = {
    swipestats: {
      container: "bg-gradient-to-r from-white via-gray-50 to-white border border-rose-200/60 rounded-lg shadow-lg",
      title: "text-gray-900 font-bold",
      description: "text-gray-600",
      button: "bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white border-none font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 rounded-lg",
      input: "bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30 transition-all duration-200 focus:outline-none rounded-lg",
      accent: "text-rose-600",
      secondaryButton: "bg-transparent border border-rose-300 text-rose-600 hover:bg-rose-50 transition-colors rounded-lg"
    },
    getdates: {
      container: "bg-gray-900 border border-gray-700 rounded-lg shadow-lg",
      title: "text-white font-bold",
      description: "text-gray-300", 
      button: "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black border-none font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 rounded-lg",
      input: "bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all duration-200 focus:outline-none rounded-lg",
      accent: "text-yellow-400",
      secondaryButton: "bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors rounded-lg"
    }
  };

  const styles = themeStyles[theme];

  // Default buttons configuration
  const defaultButtons = [
    { text: "Dating App Stats", link: "/", primary: true },
    { text: "Dating Profile Review", link: "/profile-review", primary: true },
    { text: "AI Dating Photos", link: "/ai-photos", primary: true },
    { text: "Join Our Newsletter", link: "/newsletter", primary: false }
  ];

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement with tRPC newsletter integration
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <div className={`p-6 text-center max-w-sm w-full mx-auto ${styles.container} ${className}`}>
      {/* Title and description */}
      <div className="mb-4">
        <h3 className={`text-lg mb-2 ${styles.title}`}>{title}</h3>
        <div className={`text-sm leading-relaxed ${styles.description}`}>
          {description}
        </div>
      </div>

      {/* Stats/social proof */}
      {stats && (
        <div className="mb-4">
          <span className={`text-xs font-medium ${styles.accent}`}>
            ✨ {stats}
          </span>
        </div>
      )}

      {/* Four button layout */}
      <div className="space-y-2">
        {defaultButtons.map((button, index) => (
          <Link
            key={index}
            href={button.link}
            className={`flex items-center justify-center text-center text-sm px-4 py-2 w-full ${
              button.primary ? styles.button : styles.secondaryButton
            }`}
          >
            {button.text}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CTASidebar;