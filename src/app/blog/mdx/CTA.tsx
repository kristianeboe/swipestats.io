"use client";

import React from "react";
import Link from "next/link";

import { env } from "@/env";

interface CTAProps {
  id?: string;
  label: string;
  link?: string; // NOTE: Must use 'link' instead of 'href' - MDX crashes with 'href' prop even though the component handles it correctly
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}

export function CTA({
  id,
  label,
  link = "/",
  variant = "primary",
  className,
}: CTAProps) {
  const baseClasses =
    "inline-flex items-center rounded-lg px-4 py-2 font-semibold transition-colors";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    ghost: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className || ""}`;

  // MDX requires full URLs with protocol for proper handling
  // Use NEXT_PUBLIC_BASE_URL to avoid hydration mismatches
  const getFullUrl = (path: string): string => {
    // If already a full URL, return as-is
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    // Use validated env var (defaults to https://swipestats.io)
    return `${env.NEXT_PUBLIC_BASE_URL}${path}`;
  };

  const resolvedLink = getFullUrl(link);

  return (
    <div className="my-6 text-center">
      <Link href={resolvedLink} id={id} className={combinedClasses}>
        {label}
      </Link>
    </div>
  );
}
