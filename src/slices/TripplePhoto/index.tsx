import { Text } from "@/app/_components/ui/text";
import { type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";
import Image from "next/image";
import { type JSX } from "react";
/**
 * Props for `TripplePhoto`.
 */
export type TripplePhotoProps = SliceComponentProps<Content.TripplePhotoSlice>;

/**
 * Component for "TripplePhoto" Slices.
 */
const TripplePhoto = ({ slice }: TripplePhotoProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Text.H2>{slice.primary.title}</Text.H2>
      <div className="grid grid-cols-3">
        <Image
          src={slice.primary.image1.url!}
          alt={slice.primary.image1.alt ?? ""}
          width={400}
          height={400}
        />
        <Image
          src={slice.primary.image2.url!}
          alt={slice.primary.image2.alt ?? ""}
          width={400}
          height={400}
        />
        <Image
          src={slice.primary.imag3.url!}
          alt={slice.primary.imag3.alt ?? ""}
          width={400}
          height={400}
        />
      </div>
    </section>
  );
};

export default TripplePhoto;
