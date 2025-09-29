import React from "react";
import Link from "next/link";

interface CTAProps {
  id?: string;
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}

export function CTA({
  id,
  label,
  href,
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

  return (
    <div className="my-6 text-center">
      <Link href={href} id={id} className={combinedClasses}>
        {label}
      </Link>
    </div>
  );
}
