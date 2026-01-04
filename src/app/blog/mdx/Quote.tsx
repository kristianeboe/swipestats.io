import React from "react";
import { Quote as QuoteIcon } from "lucide-react";

interface QuoteProps {
  children: React.ReactNode;
  author?: string;
  role?: string;
  avatar?: string;
}

export function Quote({ children, author, role, avatar }: QuoteProps) {
  return (
    <div className="my-8 rounded-lg bg-gray-50 p-6">
      <div className="mb-4">
        <QuoteIcon className="h-8 w-8 text-gray-400" />
      </div>
      <blockquote className="text-lg italic text-gray-800">
        {children}
      </blockquote>
      {author && (
        <div className="mt-4 flex items-center gap-3">
          {avatar && (
            <img
              src={avatar}
              alt={author}
              className="h-10 w-10 rounded-full object-cover"
            />
          )}
          <div>
            <div className="font-semibold text-gray-900">{author}</div>
            {role && <div className="text-sm text-gray-600">{role}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
