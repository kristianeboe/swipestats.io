import React from "react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { Calendar, Clock } from "lucide-react";

interface AuthorCardProps {
  author: string;
  authorImage?: string;
  role?: string;
  date: string;
  readingTime: number;
}

export function AuthorCard({
  author,
  authorImage,
  role = "Author",
  date,
  readingTime,
}: AuthorCardProps) {
  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-x-4">
          {authorImage ? (
            <Image
              src={authorImage}
              alt={author}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-200"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 ring-2 ring-gray-200">
              <span className="text-xl font-semibold text-white">
                {author.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <p className="text-lg font-semibold text-gray-900">{author}</p>
            <p className="text-sm text-gray-600">{role}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm text-gray-600 sm:items-end">
          <div className="flex items-center gap-x-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={date}>
              {format(parseISO(date), "MMM dd, yyyy")}
            </time>
          </div>
          <div className="flex items-center gap-x-2">
            <Clock className="h-4 w-4" />
            <span>{readingTime} min read</span>
          </div>
        </div>
      </div>
    </div>
  );
}
