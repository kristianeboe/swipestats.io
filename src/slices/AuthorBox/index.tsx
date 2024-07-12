import { Card } from "@/app/_components/ui/card";
import { getPrismicLinkUrl } from "@/lib/utils/prismic.utils";
import { type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";
import Link from "next/link";

/**
 * Props for `AuthorBox`.
 */
export type AuthorBoxProps = SliceComponentProps<Content.AuthorBoxSlice>;

/**
 * Component for "AuthorBox" Slices.
 */
const AuthorBox = ({ slice }: AuthorBoxProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mt-20"
    >
      <Card.Container className="mx-auto w-full max-w-md">
        <Card.Header className="bg-muted/20 p-6">
          <img
            src={slice.primary.author_image.url!}
            width={192}
            height={192}
            alt="Profile Picture"
            className="mx-auto h-48 w-48 rounded-full object-cover"
          />
        </Card.Header>
        <Card.Header className="bg-muted/20 p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="grid gap-1 text-center">
              <h2 className="text-2xl font-bold">
                {slice.primary.author_name}
              </h2>
              <p className="text-muted-foreground">
                {slice.primary.author_role}
              </p>
            </div>
          </div>
        </Card.Header>
        <Card.Content className="grid gap-4 p-6">
          <div className="grid gap-2">
            <p className="text-muted-foreground">
              {slice.primary.author_description}
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link
              href={getPrismicLinkUrl(slice.primary.author_x)}
              aria-label="X.com"
              className="text-muted-foreground hover:text-primary transition-colors"
              prefetch={false}
            >
              <XIcon className="h-6 w-6" />
            </Link>
            <Link
              href={getPrismicLinkUrl(slice.primary.author_instagram)}
              aria-label="Instagram"
              className="text-muted-foreground hover:text-primary transition-colors"
              prefetch={false}
            >
              <InstagramIcon className="h-6 w-6" />
            </Link>
            <Link
              href={getPrismicLinkUrl(slice.primary.author_linkedin)}
              aria-label="LinkedIn"
              className="text-muted-foreground hover:text-primary transition-colors"
              prefetch={false}
            >
              <LinkedinIcon className="h-6 w-6" />
            </Link>
          </div>
        </Card.Content>
      </Card.Container>
    </section>
  );
};

function InstagramIcon(props: { className: string }) {
  return (
    <svg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkIcon(props: { className: string }) {
  return (
    <svg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function LinkedinIcon(props: { className: string }) {
  return (
    <svg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function XIcon(props: { className: string }) {
  return (
    <svg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default AuthorBox;
