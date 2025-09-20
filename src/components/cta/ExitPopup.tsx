"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Types for component props
interface SocialProofStat {
  text: string;
  iconType: string;
}

interface TrustIndicator {
  fullText: string;
  shortText: string;
  iconType: string;
}

interface ExitPopupProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  theme?: "swipestats" | "getdates";
  className?: string;
  socialProofStats?: SocialProofStat[];
  trustIndicators?: TrustIndicator[];
}

// Exit intent popup for user retention - redirects to AI photos page
const ExitPopup = ({ 
  title = "Wait! Don't Leave Yet...",
  subtitle = "You're just one step away from getting game-changing photos",
  description = "Most people struggle with dating apps because their photos don't showcase their best self. Our AI creates professional-quality photos of you that actually get results.",
  primaryButtonText = "Yes, Get My AI Photos",
  primaryButtonUrl = "/",
  secondaryButtonText = "No thanks, I don't want more matches",
  theme = "swipestats",
  className = "",
  socialProofStats = [
    { text: "10,000+ photos created", iconType: "star" },
    { text: "48-hour delivery", iconType: "clock" }
  ],
  trustIndicators = [
    { fullText: "Secure payment", shortText: "Secure", iconType: "lock" },
    { fullText: "Money-back guarantee", shortText: "Guaranteed", iconType: "check" },
    { fullText: "Privacy protected", shortText: "Private", iconType: "shield" }
  ]
}: ExitPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Icon mapping function
  const getIconSvg = (iconType: string, className: string) => {
    const icons = {
      star: (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      clock: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      lock: (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      ),
      check: (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      shield: (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    };
    return icons[iconType as keyof typeof icons] || icons.star;
  };

  // Theme-based styling adapted for SwipeStats
  const themeStyles = {
    swipestats: {
      overlay: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-500 ease-out flex items-center justify-center p-2 sm:p-4",
      container: "bg-gradient-to-br from-white via-gray-50 to-white border border-rose-200/60 rounded-xl sm:rounded-2xl shadow-2xl relative overflow-hidden max-w-sm sm:max-w-lg lg:max-w-2xl w-full transition-all duration-500 ease-out transform",
      title: "text-gray-900 font-bold",
      subtitle: "text-gray-700", 
      description: "text-gray-600",
      primaryButton: "flex items-center justify-center bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white border-none font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 rounded-lg",
      secondaryButton: "text-gray-500 hover:text-gray-700 underline text-sm transition-colors",
      accent: "text-rose-600",
      glow: "absolute inset-0 bg-gradient-to-r from-rose-600/10 via-transparent to-rose-600/10 pointer-events-none",
      stats: "text-gray-600",
      closeButton: "text-gray-400 hover:text-gray-600",
      iconBg: "bg-gradient-to-br from-rose-600/20 to-rose-700/10 border border-rose-600/30"
    },
    getdates: {
      overlay: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-500 ease-out flex items-center justify-center p-2 sm:p-4",
      container: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-yellow-400/30 rounded-xl sm:rounded-2xl shadow-2xl relative overflow-hidden max-w-sm sm:max-w-lg lg:max-w-2xl w-full transition-all duration-500 ease-out transform",
      title: "text-white font-bold",
      subtitle: "text-gray-300",
      description: "text-gray-400",
      primaryButton: "flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black border-none font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 rounded-lg",
      secondaryButton: "text-gray-400 hover:text-gray-300 underline text-sm transition-colors",
      accent: "text-yellow-400",
      glow: "absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 pointer-events-none",
      stats: "text-gray-300",
      closeButton: "text-gray-400 hover:text-white",
      iconBg: "bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 border border-yellow-400/30"
    }
  };

  const styles = themeStyles[theme];

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Exit intent detection
  useEffect(() => {
    if (!isMounted) return;

    let timeoutId: NodeJS.Timeout;
    let isScrolling = false;
    let scrollTimeoutId: NodeJS.Timeout;
    let lastScrollTime = 0;
    
    const showPopup = () => {
      // Don't show if user is currently scrolling or recently scrolled
      if (!hasTriggered && !isScrolling && (Date.now() - lastScrollTime > 2000)) {
        setIsVisible(true);
        setHasTriggered(true);
        // Small delay to allow DOM update before animation
        setTimeout(() => setIsAnimatingIn(true), 50);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves through the top of the viewport
      if (e.clientY <= 0) {
        showPopup();
      }
    };

    const handleScroll = () => {
      isScrolling = true;
      lastScrollTime = Date.now();
      
      // Clear existing timeout
      clearTimeout(scrollTimeoutId);
      
      // Set scrolling to false after user stops scrolling for 1 second
      scrollTimeoutId = setTimeout(() => {
        isScrolling = false;
      }, 1000);
    };

    // Detect mobile vs desktop
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     ('ontouchstart' in window) || 
                     (navigator.maxTouchPoints > 0);

    // Also trigger after extended time if user hasn't left (longer on mobile)
    const handleTimeout = () => {
      showPopup();
    };

    // Add event listeners based on device type
    if (!isMobile) {
      // Desktop: use mouse leave detection
      document.addEventListener('mouseleave', handleMouseLeave);
    }
    
    // Both mobile and desktop: track scrolling to prevent popup during active use
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Set timeout - longer for mobile users since they're more likely to be actively engaged
    timeoutId = setTimeout(handleTimeout, isMobile ? 45000 : 30000);

    // Cleanup
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
      clearTimeout(scrollTimeoutId);
    };
  }, [hasTriggered]);

  const closePopup = () => {
    setIsAnimatingIn(false);
    // Wait for animation to complete before hiding
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`${styles.overlay} ${isAnimatingIn ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleOverlayClick}
    >
      <div className={`${styles.container} ${className} p-3 sm:p-6 lg:p-8 ${
        isAnimatingIn 
          ? 'scale-100 translate-y-0 opacity-100' 
          : 'scale-95 translate-y-4 opacity-0'
      }`}>
        {/* Subtle background glow */}
        <div className={styles.glow}></div>
        
        {/* Close button */}
        <button 
          onClick={closePopup}
          className={`absolute top-2 right-2 p-3 ${styles.closeButton} transition-colors z-20`}
          style={{ minWidth: '44px', minHeight: '44px', touchAction: 'manipulation' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative z-10 text-center">
          {/* Attention-grabbing header */}
          <div className="mb-4 sm:mb-6">
            <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 ${styles.iconBg} rounded-full mb-3 sm:mb-4`}>
              <svg className={`w-6 h-6 sm:w-8 sm:h-8 ${styles.accent}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-2 ${styles.title}`}>
              {title}
            </h2>
            
            <p className={`text-sm sm:text-base lg:text-lg ${styles.subtitle} mb-3 sm:mb-4`}>
              {subtitle}
            </p>
          </div>

          {/* Value proposition */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <p className={`text-xs sm:text-sm lg:text-base ${styles.description} mb-3 sm:mb-4 lg:mb-6 max-w-lg mx-auto leading-relaxed`}>
              {description}
            </p>

            {/* Social proof stats */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-3 sm:mb-6 text-xs sm:text-sm">
              {socialProofStats.map((stat, index) => (
                <div key={index} className="flex items-center">
                  {getIconSvg(stat.iconType, `w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 ${styles.accent}`)}
                  <span className={styles.stats}>{stat.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link 
              href={primaryButtonUrl}
              className={`w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-bold ${styles.primaryButton}`}
              onClick={closePopup}
            >
              {primaryButtonText}
            </Link>
            
            <button 
              onClick={closePopup}
              className={`${styles.secondaryButton} text-xs sm:text-sm`}
            >
              {secondaryButtonText}
            </button>
          </div>

          {/* Trust indicators */}
          <div className={`mt-4 sm:mt-6 pt-3 sm:pt-4 border-t ${theme === 'swipestats' ? 'border-gray-200' : 'border-gray-700/50'}`}>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs">
              {trustIndicators.map((indicator, index) => (
                <span key={index} className={`flex items-center ${styles.stats}`}>
                  {getIconSvg(indicator.iconType, `w-3 h-3 sm:w-4 sm:h-4 mr-1 ${styles.accent}`)}
                  <span className="hidden sm:inline">{indicator.fullText}</span>
                  <span className="sm:hidden">{indicator.shortText}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitPopup;