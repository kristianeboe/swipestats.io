import React from "react";

interface TLDRProps {
  // New simplified approach
  children?: React.ReactNode;
  className?: string;

  // Legacy props for backward compatibility
  appName?: string;
  description?: string;
  verdict?: string;
  score?: number;
  whoItsFor?: string[];
  biggestPros?: string[];
  biggestCons?: string[];
}

export function TLDR({
  children,
  className = "",
  // Legacy props
  appName,
  description,
  verdict,
  score,
  whoItsFor = [],
  biggestPros = [],
  biggestCons = [],
}: TLDRProps) {
  // If children is provided, use the new simplified approach
  if (children) {
    return (
      <div
        className={`max-w-3xl rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}
      >
        <div className="flex p-6">
          <div className="mr-4 text-2xl">⏱️</div>
          <div className="prose prose-gray max-w-none">
            <h3 className="mb-4 mt-0 text-lg font-semibold text-gray-900">
              TL;DR:
            </h3>
            <div className="text-gray-700">{children}</div>
          </div>
        </div>
      </div>
    );
  }

  // Legacy approach with structured content
  return (
    <div
      className={`max-w-3xl rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}
    >
      <div className="flex p-6">
        <div className="mr-4 text-2xl">⏱️</div>
        <div className="prose prose-gray max-w-none">
          <h3 className="mb-4 mt-0 text-lg font-semibold text-gray-900">
            TL;DR:
          </h3>

          <div className="space-y-4 text-gray-700">
            {description && (
              <div>
                <span className="font-semibold">App description:</span>{" "}
                {description}
              </div>
            )}

            {verdict && (
              <div>
                <span className="font-semibold">Our verdict/score:</span>{" "}
                {verdict}
                {score && (
                  <span className="text-sm text-gray-600"> ({score}/5)</span>
                )}
              </div>
            )}

            {whoItsFor.length > 0 && (
              <div>
                <span className="font-semibold">Who it's for:</span>
                <ul className="mt-1 list-disc pl-5 text-sm">
                  {whoItsFor.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {biggestPros.length > 0 && (
              <div>
                <span className="font-semibold">Biggest pros:</span>
                <ul className="mt-1 list-disc pl-5 text-sm">
                  {biggestPros.map((pro, index) => (
                    <li key={index}>{pro}</li>
                  ))}
                </ul>
              </div>
            )}

            {biggestCons.length > 0 && (
              <div>
                <span className="font-semibold">Biggest cons:</span>
                <ul className="mt-1 list-disc pl-5 text-sm">
                  {biggestCons.map((con, index) => (
                    <li key={index}>{con}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
