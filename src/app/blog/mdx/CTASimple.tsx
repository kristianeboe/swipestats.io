"use client";

import Image from "next/image";
import Link from "next/link";

interface CTASimpleProps {
  emoji?: string;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  imageSrc?: string;
  className?: string;
}

export function CTASimple({
  emoji = "📊",
  heading = "Visualize Your Tinder Data",
  description = "Curious where you stand on the dating market? Anonymously upload your data to Swipestats and find out today (it's free)",
  buttonText = "Learn How(It's FREE)",
  buttonUrl = "/upload/tinder",
  imageSrc = "/ss2.png",
  className = "",
}: CTASimpleProps) {
  return (
    <section
      className={`relative mt-10 max-w-4xl rounded-xl border-l-8 border-rose-600 bg-white p-6 shadow-lg ring-1 ring-gray-900/10 ${className}`}
    >
      <div className="md:mr-52">
        <h3 className="text-2xl font-bold leading-8 text-gray-900">
          {emoji} {heading}
        </h3>
        <p className="mt-4 text-base leading-7 text-gray-600">{description}</p>
        <div className="mt-6 flex items-center gap-x-5">
          <Link
            href={buttonUrl}
            className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2"
          >
            {buttonText}
          </Link>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 z-0 hidden md:block">
        <Image
          src={imageSrc}
          alt="Swipestats CTA image"
          height={200}
          width={200}
          className="pointer-events-auto h-[200px] rounded-r-lg object-cover"
        />
      </div>
    </section>
  );
}
