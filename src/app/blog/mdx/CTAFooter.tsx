"use client";

import Image from "next/image";
import Link from "next/link";

// Types for component props
interface BeforeImage {
  src?: string;
  alt?: string;
}

interface AfterImage {
  src?: string;
  alt?: string;
}

interface CTAFooterProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  beforeImages?: BeforeImage[];
  afterImages?: AfterImage[];
  theme?: "swipestats" | "getdates";
  className?: string;
  fullWidth?: boolean;
}

// Large footer CTA component showcasing AI photo transformation
export const CTAFooter = ({
  title = "Transform Your Dating Profile",
  subtitle = "Our AI turns your ordinary photos into optimal dating profile pictures that get results",
  description = "Upload your photos and get professionally enhanced versions in 48 hours",
  buttonText = "Check It Out",
  buttonUrl = "/",
  beforeImages = [],
  afterImages = [],
  theme = "swipestats",
  className = "",
  fullWidth = true,
}: CTAFooterProps) => {
  // Default before images if none provided
  const defaultBeforeImages: BeforeImage[] = [
    { src: "/images/get_dates/IMG_5344.jpg", alt: "Original casual photo 1" },
    { src: "/images/get_dates/IMG_5478.jpg", alt: "Original casual photo 2" },
    {
      src: "/images/get_dates/paw smiling 2.jpeg",
      alt: "Original casual photo 3",
    },
    {
      src: "/images/get_dates/paw-headshot 7.jpeg",
      alt: "Original casual photo 4",
    },
  ];

  // Default after images if none provided
  const defaultAfterImages: AfterImage[] = [
    { src: "/images/get_dates/PBS.png", alt: "AI Enhanced Dating Photo 1" },
    { src: "/images/get_dates/PCP.png", alt: "AI Enhanced Dating Photo 2" },
    { src: "/images/get_dates/PJS.png", alt: "AI Enhanced Dating Photo 3" },
    { src: "/images/get_dates/PSB.png", alt: "AI Enhanced Dating Photo 4" },
  ];

  const beforeImagesArray =
    beforeImages.length > 0 ? beforeImages : defaultBeforeImages;
  const afterImagesArray =
    afterImages.length > 0 ? afterImages : defaultAfterImages;

  // Theme-based styling adapted for SwipeStats
  const themeStyles = {
    swipestats: {
      container:
        "bg-gradient-to-br from-rose-50 via-gray-50 to-rose-100/80 border-t border-rose-200/60",
      title: "text-gray-900 font-bold",
      subtitle: "text-gray-700",
      description: "text-gray-600",
      primaryButton:
        "inline-flex items-center justify-center bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white border-none font-bold shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg",
      accent: "text-rose-600",
      beforeAfter: {
        before:
          "bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm",
        after:
          "bg-gradient-to-br from-rose-50 to-rose-100/50 border border-rose-200 rounded-2xl overflow-hidden shadow-md",
        arrow: "text-rose-600",
        beforeBg: "bg-gray-100",
        afterBg:
          "bg-gradient-to-br from-rose-100/50 to-rose-50/30 border border-rose-200/20",
        afterImageBorder: "border border-rose-200/30",
        starIcon: "text-rose-600",
      },
      stats: "text-gray-600",
      feature: "bg-white border border-gray-200 rounded-xl",
      featureIconBg:
        "bg-gradient-to-br from-rose-100/50 to-rose-50/30 border border-rose-200/20",
    },
    getdates: {
      container:
        "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-t border-gray-800",
      title: "text-white font-bold",
      subtitle: "text-gray-300",
      description: "text-gray-400",
      primaryButton:
        "inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black border-none font-bold shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg",
      accent: "text-yellow-400",
      beforeAfter: {
        before:
          "bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-lg",
        after:
          "bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 border border-yellow-400/30 rounded-2xl overflow-hidden shadow-xl",
        arrow: "text-yellow-400",
        beforeBg: "bg-gray-700",
        afterBg:
          "bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 border border-yellow-400/20",
        afterImageBorder: "border border-yellow-400/20",
        starIcon: "text-yellow-400",
      },
      stats: "text-gray-300",
      feature: "bg-gray-800/50 border border-gray-700/50 rounded-xl",
      featureIconBg:
        "bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 border border-yellow-400/20",
    },
  };

  const styles = themeStyles[theme];

  return (
    <footer
      className={`${fullWidth ? "relative left-1/2 w-screen -translate-x-1/2 transform" : "w-full"} py-12 lg:py-16 ${styles.container} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 text-center lg:mb-12">
          <h2 className={`mb-6 text-4xl font-bold lg:text-5xl ${styles.title}`}>
            {title}
          </h2>
          <p
            className={`text-xl lg:text-2xl ${styles.subtitle} mx-auto mb-4 max-w-3xl`}
          >
            {subtitle}
          </p>
          <p className={`text-lg ${styles.description} mx-auto max-w-2xl`}>
            {description}
          </p>
        </div>

        {/* Before/After Visual Demonstration */}
        <div className="mb-12">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-8 lg:flex-row lg:gap-12">
            {/* Before - Input Photo Collage */}
            <div className="w-full max-w-sm flex-1">
              <div className={`p-4 ${styles.beforeAfter.before}`}>
                <div className="mb-3 text-center">
                  <h3 className={`text-lg font-semibold ${styles.title} mb-1`}>
                    Your Photos
                  </h3>
                  <p className={`text-sm ${styles.description}`}>
                    Regular selfies & casual shots
                  </p>
                </div>

                {/* Input Photo Collage - Grid of casual photos */}
                <div
                  className={`aspect-square ${styles.beforeAfter.beforeBg} mb-3 rounded-xl p-3`}
                >
                  <div className="grid h-full grid-cols-2 gap-2">
                    {beforeImagesArray.slice(0, 4).map((image, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden rounded-lg bg-gray-600"
                      >
                        <Image
                          src={image.src || "/api/placeholder/200/200"}
                          alt={
                            image.alt || `Original casual photo ${index + 1}`
                          }
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 150px, 200px"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Before characteristics - condensed */}
                <div className="flex justify-center gap-4 text-xs">
                  <span className={`flex items-center ${styles.description}`}>
                    <svg
                      className={`mr-1 h-3 w-3 ${styles.description}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Boring photos
                  </span>
                  <span className={`flex items-center ${styles.description}`}>
                    <svg
                      className={`mr-1 h-3 w-3 ${styles.description}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Cookie-cutter style
                  </span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center">
                <div
                  className={`h-12 w-12 rounded-full ${theme === "swipestats" ? "border border-gray-300 bg-gradient-to-r from-gray-200 to-gray-100" : "border border-gray-600 bg-gradient-to-r from-gray-800 to-gray-700"} flex items-center justify-center`}
                >
                  <svg
                    className={`h-6 w-6 ${styles.beforeAfter.arrow}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
              <p
                className={`mt-2 text-center text-xs ${styles.accent} font-medium`}
              >
                AI Enhancement
              </p>
            </div>

            {/* After - Output Photo Collage */}
            <div className="w-full max-w-sm flex-1">
              <div className={`p-4 ${styles.beforeAfter.after}`}>
                <div className="mb-3 text-center">
                  <h3 className={`text-lg font-semibold ${styles.title} mb-1`}>
                    AI Enhanced
                  </h3>
                  <p className={`text-sm ${styles.description}`}>
                    Professional-quality results
                  </p>
                </div>

                {/* Output Photo Collage - Grid of enhanced photos */}
                <div
                  className={`aspect-square ${styles.beforeAfter.afterBg} relative mb-3 overflow-hidden rounded-xl p-3`}
                >
                  <div className="grid h-full grid-cols-2 gap-2">
                    {afterImagesArray.slice(0, 4).map((image, index) => (
                      <div
                        key={index}
                        className={`from-opacity-30 to-opacity-20 relative overflow-hidden rounded-lg bg-gradient-to-br ${styles.beforeAfter.afterImageBorder}`}
                      >
                        <Image
                          src={image.src || "/api/placeholder/200/200"}
                          alt={image.alt || `AI Enhanced Photo ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 150px, 200px"
                        />
                        <div className="absolute right-1 top-1">
                          <svg
                            className={`h-3 w-3 ${styles.beforeAfter.starIcon} animate-pulse`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* After benefits - condensed */}
                <div className="flex justify-center gap-4 text-xs">
                  <span className={`flex items-center ${styles.stats}`}>
                    <svg
                      className={`mr-1 h-3 w-3 ${styles.accent}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Eye-catching and unique
                  </span>
                  <span className={`flex items-center ${styles.stats}`}>
                    <svg
                      className={`mr-1 h-3 w-3 ${styles.accent}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Minimal effort
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid - Condensed */}
        <div className="mb-10 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              ),
              title: "AI-Generated Photos",
              description:
                "Professional-quality dating profile photos from your uploads",
            },
            {
              icon: (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
              title: "48-Hour Turnaround",
              description: "Get your enhanced photos delivered quickly",
            },
            {
              icon: (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              ),
              title: "More Matches Guaranteed",
              description: "Proven to increase match rates or money back",
            },
          ].map((feature, index) => (
            <div key={index} className={`p-4 ${styles.feature} text-center`}>
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${styles.featureIconBg} mb-3 ${styles.accent}`}
              >
                {feature.icon}
              </div>
              <h3 className={`mb-2 text-base font-bold ${styles.title}`}>
                {feature.title}
              </h3>
              <p className={`text-sm ${styles.description} leading-relaxed`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 max-w-2xl">
            <h3
              className={`mb-3 text-2xl font-bold lg:text-3xl ${styles.title}`}
            >
              Ready to Get More Matches?
            </h3>
            <p className={`text-base ${styles.subtitle} mb-5`}>
              Take your dating game to the next level with AI-enhanced photos
            </p>

            <Link
              href={buttonUrl}
              className={`px-8 py-4 text-lg ${styles.primaryButton} mb-3`}
            >
              {buttonText}
            </Link>
          </div>
        </div>

        {/* Social Proof Stats */}
        <div
          className={`border-t ${theme === "swipestats" ? "border-gray-200" : "border-gray-700"} pt-6`}
        >
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <span className={`flex items-center ${styles.stats}`}>
              <svg
                className={`mr-2 h-5 w-5 ${styles.accent}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              10,000+ photos created
            </span>
            <span className={`flex items-center ${styles.stats}`}>
              <svg
                className={`mr-2 h-5 w-5 ${styles.accent}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Money-back guarantee
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
