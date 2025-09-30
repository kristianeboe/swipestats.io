"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Types for component props
interface ProductImage {
  src?: string;
  alt?: string;
}

interface CTAProductLinksProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  productImages?: ProductImage[];
  featuresList?: string[];
  theme?: "swipestats" | "getdates";
  className?: string;
}

// Product links CTA for mid-article placement - drives traffic to main product
export const CTAProductLinks = ({
  title = "📸 Got Boring Photos?",
  description = "Swipestats analysis reveals that profile photos are the driving factor in getting you likes and matches. Get eye-catching photos that make you stand out from the crowd and actually get dates.",
  buttonText = "Check It Out",
  buttonUrl = "/",
  productImages = [],
  featuresList = [
    "More matches or your money back",
    "AI-generated photos",
    "48-hour turnaround",
  ],
  theme = "swipestats",
  className = "",
}: CTAProductLinksProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Default images if none provided (SwipeStats themed)
  const defaultImages: ProductImage[] = [
    { src: "/images/get_dates/PBS.png", alt: "AI Enhanced Dating Photo 1" },
    { src: "/images/get_dates/PCP.png", alt: "AI Enhanced Dating Photo 2" },
    { src: "/images/get_dates/PJS.png", alt: "AI Enhanced Dating Photo 3" },
    { src: "/images/get_dates/PVB.png", alt: "AI Enhanced Dating Photo 4" },
    { src: "/images/get_dates/PSB.png", alt: "AI Enhanced Dating Photo 5" },
  ];

  const images = productImages.length > 0 ? productImages : defaultImages;

  // Auto-slide carousel
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  // Theme-based styling adapted for SwipeStats
  const themeStyles = {
    swipestats: {
      container:
        "bg-gradient-to-r from-white via-gray-50 to-white border border-rose-200/60 rounded-2xl backdrop-blur-sm shadow-lg relative overflow-hidden",
      title: "text-gray-900 font-bold",
      description: "text-gray-600",
      button:
        "flex items-center justify-center bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white border-none font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 rounded-lg",
      accent: "text-rose-600",
      icon: "text-rose-600",
      glow: "absolute inset-0 bg-gradient-to-r from-rose-600/5 via-transparent to-rose-600/5 pointer-events-none",
      stats: "text-gray-500",
      aiTag: "bg-gradient-to-r from-rose-600 to-rose-700 text-white",
      indicator: "bg-rose-600",
      indicatorInactive: "bg-gray-300",
    },
    getdates: {
      container:
        "bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 border border-yellow-400/20 rounded-2xl backdrop-blur-sm shadow-lg relative overflow-hidden",
      title: "text-white font-bold",
      description: "text-gray-300",
      button:
        "flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black border-none font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 rounded-lg",
      accent: "text-yellow-400",
      icon: "text-yellow-400",
      glow: "absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-transparent to-yellow-400/5 pointer-events-none",
      stats: "text-gray-400",
      aiTag: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black",
      indicator: "bg-yellow-400",
      indicatorInactive: "bg-white/50",
    },
  };

  const styles = themeStyles[theme];

  return (
    <div className={`my-6 p-5 ${styles.container} ${className} w-full`}>
      {/* Subtle background glow */}
      <div className={styles.glow}></div>

      {/* Mobile-only heading above grid */}
      <div className="mb-4 flex items-center justify-center md:hidden">
        <h3
          className={`text-xl font-bold sm:text-2xl ${styles.title} text-center leading-tight`}
          style={{ margin: 0, lineHeight: 1.1 }}
        >
          {title}
        </h3>
      </div>

      <div className="relative z-10 grid grid-cols-1 items-stretch gap-3 md:aspect-[8/5] md:grid-cols-2 md:gap-5">
        {/* Left Section - AI Photo Carousel */}
        <div
          className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[5/6]"
          style={{ borderRadius: "12px" }}
        >
          {images.length > 0 && images[currentImageIndex] && (
            <>
              <Image
                src={
                  images[currentImageIndex].src || "/api/placeholder/400/500"
                }
                alt={
                  images[currentImageIndex].alt ||
                  `AI Enhanced Photo ${currentImageIndex + 1}`
                }
                fill
                className="object-cover transition-all duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </>
          )}

          {/* AI-generated tag */}
          <div
            className={`absolute right-3 top-3 ${styles.aiTag} rounded-full px-2 py-1 text-xs font-bold shadow-lg`}
          >
            ✨ AI-Generated
          </div>

          {/* Carousel indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 transform space-x-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`rounded-sm transition-colors ${
                    index === currentImageIndex
                      ? styles.indicator
                      : styles.indicatorInactive
                  }`}
                  style={{
                    width: "16px",
                    height: "5px",
                  }}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Section - Copy and CTA */}
        <div
          className="flex h-full flex-col justify-start p-2 text-center md:p-3 md:text-left"
          style={{ gap: "clamp(3rem, 8vw, 5rem)" }}
        >
          <div className="hidden items-center justify-center md:flex md:justify-start">
            <h3
              className={`text-xl font-bold sm:text-2xl md:text-3xl ${styles.title} leading-tight`}
              style={{ margin: 0, lineHeight: 1.1 }}
            >
              {title}
            </h3>
          </div>

          <div className="flex items-center justify-center md:justify-start">
            <p
              className={`text-base sm:text-lg md:text-xl ${styles.description} leading-relaxed`}
            >
              {description}
            </p>
          </div>

          {/* Quick benefits */}
          <div className="flex items-center justify-center md:justify-start">
            <div className="flex flex-col items-start gap-3 text-base md:text-lg">
              {featuresList.map((feature, index) => {
                // Mobile-optimized shorter versions of features
                const mobileFeatures = [
                  "Guaranteed results",
                  "AI-generated photos",
                  "48-hour turnaround",
                ];

                return (
                  <span
                    key={index}
                    className={`flex items-center ${styles.stats}`}
                  >
                    <svg
                      className={`mr-3 h-5 w-5 md:h-6 md:w-6 ${styles.accent} flex-shrink-0`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {/* Show shorter text on mobile, full text on desktop */}
                    <span className="sm:hidden">
                      {mobileFeatures[index] || feature}
                    </span>
                    <span className="hidden sm:inline">{feature}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* CTA Button */}
          <div
            style={{ marginTop: "clamp(1rem, 3vw, 1.5rem)" }}
            className="flex justify-center"
          >
            <Link
              href={buttonUrl}
              className={`w-full px-6 py-4 text-center text-base font-semibold md:px-8 md:py-5 md:text-lg ${styles.button}`}
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
