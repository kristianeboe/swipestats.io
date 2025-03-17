"use client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

export default function LiveDemoLink() {
  const [isPending, startTransition] = useTransition();

  return (
    <Link
      href="/insights/demo"
      className="group text-sm font-semibold leading-6 text-gray-900 transition-colors hover:text-gray-700"
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClick={() => startTransition(() => {})}
    >
      Live demo{" "}
      {isPending ? (
        <span className="inline-block translate-x-1 transform transition-transform duration-200">
          <Loader2 className="inline-block h-3 w-3 animate-spin" />
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="inline-block w-3 transform transition-transform duration-200 group-hover:translate-x-1"
        >
          →
        </span>
      )}
    </Link>
  );
}
