import { Card } from "@/app/_components/ui/card";
import { type Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";

/**
 * Props for `TldrBox`.
 */
export type TldrBoxProps = SliceComponentProps<Content.TldrBoxSlice>;

/**
 * Component for "TldrBox" Slices.
 */
const TldrBox = ({ slice }: TldrBoxProps): JSX.Element => {
  return (
    <Card.Container
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="max-w-3xl"
    >
      <div className="flex p-6">
        {/* <div className="mr-4">{slice.primary.emoji}</div> */}
        <div className="prose">
          <PrismicRichText field={slice.primary.tldr_content} />
        </div>
      </div>
    </Card.Container>
  );
};

export default TldrBox;
