import type { ImageField } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import Image from "next/image";

type ImgProps = {
  field: ImageField | null | undefined;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  alt?: string;
};

/**
 * Renders a Prismic image field through Imgix. Seed images (still on the old
 * site, before the import) go through next/image.
 */
export function Img({
  field,
  className,
  sizes = "(min-width: 1920px) 1920px, 100vw",
  priority,
  fill,
  alt,
}: ImgProps) {
  if (!field || !isFilled.image(field)) return null;

  if (!field.url.includes("images.prismic.io")) {
    return (
      <Image
        src={field.url}
        alt={alt ?? field.alt ?? ""}
        className={className}
        sizes={sizes}
        priority={priority}
        {...(fill ? { fill: true } : { width: field.dimensions.width, height: field.dimensions.height })}
      />
    );
  }

  return (
    <PrismicNextImage
      field={field}
      className={className}
      sizes={sizes}
      priority={priority}
      fill={fill}
      {...(alt !== undefined ? { alt: alt as "" } : { fallbackAlt: "" })}
    />
  );
}
