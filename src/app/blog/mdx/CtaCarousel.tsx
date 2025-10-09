"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Types for component props
interface ProductImage {
  src?: string;
  alt?: string;
}

interface CtaCarouselProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  productImages?: ProductImage[];
  featuresList?: string[];
  theme?: "swipestats" | "getdates";
  className?: string;
}

/**
 * CtaCarousel - Propless CTA for promoting AI dating photos
 *
 * Use this component without props in blog posts to promote the AI photo service.
 * Features proven copy and showcases AI-generated photos.
 *
 * @example
 * <CtaCarousel />
 */
export const CtaCarousel = ({
  title = "📸 Struggling with Matches?",
  description = "Our data shows photos are the #1 factor in getting matches. Get AI-enhanced photos that make you stand out and actually get dates.",
  buttonText = "Transform Your Profile",
  buttonUrl = "/ai-dating-photos",
  productImages = [],
  featuresList = [
    "More matches or your money back",
    "AI-generated photos in 48 hours",
    "Used by 10,000+ daters",
  ],
  theme = "swipestats",
  className = "",
}: CtaCarouselProps = {}) => {
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
    <div
      className={`my-6 p-4 sm:p-6 lg:p-8 ${styles.container} ${className} w-full`}
    >
      {/* Subtle background glow */}
      <div className={styles.glow}></div>

      {/* Mobile-only heading above grid */}
      <div className="mb-6 text-center md:hidden">
        <h3 className={`text-2xl font-bold ${styles.title} leading-tight`}>
          {title}
        </h3>
      </div>

      <div className="relative z-10 grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-8 lg:gap-12">
        {/* Left Section - AI Photo Carousel */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-xl">
          {images.length > 0 && images[currentImageIndex] && (
            <Image
              src={images[currentImageIndex].src || "/api/placeholder/400/500"}
              alt={
                images[currentImageIndex].alt ||
                `AI Enhanced Photo ${currentImageIndex + 1}`
              }
              fill
              className="rounded-2xl object-cover transition-all duration-700 ease-in-out"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}

          {/* AI-generated tag */}
          <div
            className={`absolute left-1/2 top-3 -translate-x-1/2 ${styles.aiTag} rounded-full px-3 py-1.5 text-xs font-bold shadow-lg backdrop-blur-sm`}
          >
            ✨ AI-Generated
          </div>

          {/* Carousel indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? `${styles.indicator} w-8`
                      : `${styles.indicatorInactive} w-1.5`
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Section - Copy and CTA */}
        <div className="flex flex-col justify-center gap-6 text-center md:text-left">
          {/* Desktop heading */}
          <div className="hidden md:block">
            <h3
              className={`text-3xl font-bold lg:text-4xl ${styles.title} leading-tight`}
            >
              {title}
            </h3>
          </div>

          {/* Description */}
          <div>
            <p
              className={`text-base sm:text-lg ${styles.description} leading-relaxed`}
            >
              {description}
            </p>
          </div>

          {/* Features list */}
          <div className="flex justify-center md:justify-start">
            <div className="flex flex-col gap-3">
              {featuresList.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 ${styles.stats}`}
                >
                  <svg
                    className={`h-5 w-5 flex-shrink-0 ${styles.accent}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium sm:text-base">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-2">
            <Link
              href={buttonUrl}
              className={`inline-block w-full px-8 py-4 text-center text-base font-bold sm:text-lg ${styles.button}`}
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
