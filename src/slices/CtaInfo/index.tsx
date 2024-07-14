import { Alert } from "@/app/_components/tw/Alert";
import { Button } from "@/app/_components/ui/button";
import { Text } from "@/app/_components/ui/text";
import { getPrismicLinkUrl } from "@/lib/utils/prismic.utils";
import { type Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { type SliceComponentProps } from "@prismicio/react";
import Image from "next/image";
import Link from "next/link";

/**
 * Props for `CtaInfo`.
 */
export type CtaInfoProps = SliceComponentProps<Content.CtaInfoSlice>;

/**
 * Component for "CtaInfo" Slices.
 */
const CtaInfo = ({ slice }: CtaInfoProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative mt-10"
    >
      <div className="absolute bottom-0 left-0 flex w-full justify-end">
        {slice.primary.image.url ? (
          <PrismicNextImage field={slice.primary.image} />
        ) : (
          <Image
            src={
              "https://images.prismic.io/swipestats/ZpGD7R5LeNNTxH-S_pikaso_texttoimage_35mm-film-photography-handsome-masculine-man-pensi-9-BackgroundRemovedBackgroundRemoved.png?auto=format,compress"
            }
            alt="Swipestats CTA image"
            height={200}
            width={200}
          />
        )}
      </div>
      <div className="rounded-xl border-l-8 border-rose-600 bg-white p-6 shadow-lg ring-1 ring-gray-900/10">
        <Text.H3>
          {slice.primary.emoji} {slice.primary.heading}
        </Text.H3>
        <h2 className="text-xl font-bold"></h2>
        <Text.P>{slice.primary.body}</Text.P>
        <p className="text-sm leading-6 text-gray-900"></p>
        <div className="mt-4 flex items-center gap-x-5">
          <Link href={getPrismicLinkUrl(slice.primary.link)}>
            <Button>{"Learn How"}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaInfo;
