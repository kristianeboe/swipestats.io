import { type Content } from "@prismicio/client";
import { type SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Video`.
 */
export type VideoProps = SliceComponentProps<Content.VideoSlice>;

/**
 * Component for "Video" Slices.
 */
const Video = ({ slice }: VideoProps): JSX.Element => {
  if (!slice.primary.video_embed.html) return <div>No video to embed</div>;

  const videoUrl = new URL(slice.primary.video_embed.embed_url);
  const videoId = videoUrl.searchParams.get("v");
  if (!videoId)
    return (
      <div>
        <div>
          No video ID found, make sure the embed url has a
          &quot;?v=videoId&quot;
        </div>
        <div>Current embed url: {slice.primary.video_embed.embed_url}</div>
      </div>
    );
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="mx-auto my-8 max-w-4xl">
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          {/* <div className="bg-gray-100 p-4">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          </div> */}
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
          {/* <div className="p-4">
            <p className="text-gray-600">{description}</p>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Video;
