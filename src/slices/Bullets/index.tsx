import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";
import { type JSX } from "react";

/**
 * Props for `Bullets`.
 */
export type BulletsProps = SliceComponentProps<Content.BulletsSlice>;

/**
 * Component for "Bullets" Slices.
 */
const Bullets = ({ slice }: BulletsProps): JSX.Element => {
  return (
    <ul
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      role="list"
      className="mt-8 max-w-xl space-y-8 text-gray-600"
    >
      {slice.primary.bullets.map((bullet) => (
        <li key={bullet.bold} className="flex gap-x-3">
          {slice.primary.emoji ? (
            slice.primary.emoji
          ) : (
            <CheckCircleIcon
              className="mt-1 h-5 w-5 flex-none text-indigo-600"
              aria-hidden="true"
            />
          )}

          <span>
            <strong className="font-semibold text-gray-900">
              {bullet.bold}.
            </strong>{" "}
            {bullet.body}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default Bullets;
