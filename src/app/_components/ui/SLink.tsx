import { cn } from "@/lib/utils";
import Link from "next/link";

export function SLink(props: {
  href: string;
  children: React.ReactNode;
  newTab?: boolean;
  className?: string;
}) {
  if (props.href.startsWith("http")) {
    return (
      <a
        href={props.href}
        target={props.newTab ? "_blank" : "_self"}
        className={cn("text-rose-600 underline", props.className)}
      >
        {props.children}
      </a>
    );
  }

  return (
    <Link
      href={props.href}
      target={props.newTab ? "_blank" : "_self"}
      className={cn("text-rose-600 underline", props.className)}
    >
      {props.children}
    </Link>
  );
}
