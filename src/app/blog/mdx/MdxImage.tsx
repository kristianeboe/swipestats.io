import Image from "next/image";

interface MdxImageProps {
  src: string;
  alt: string;
}

export function MdxImage({ src, alt }: MdxImageProps) {
  return (
    <div className="my-8">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={800}
        className="w-full rounded-lg border border-gray-200 shadow-md"
      />
    </div>
  );
}
