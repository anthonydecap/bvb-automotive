import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Img } from "@/components/Img";
import { Reveal } from "@/components/Reveal";
import { InlineRichText, Title } from "@/components/RichText";

export type GalleryProps = SliceComponentProps<Content.GallerySlice>;

/** Work from the studio as a row of large photographs the visitor drags sideways. */
const Gallery = ({ slice }: GalleryProps) => {
  const p = slice.primary;
  const images = p.images.map((i) => i.image).filter((i) => isFilled.image(i));

  return (
    <section data-slice-type={slice.slice_type} className="section overflow-hidden bg-night text-chalk">
      <Reveal className="frame grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
        <Title field={p.title} className="speed head lg:col-span-7" />
        {isFilled.richText(p.intro) && (
          <div className="text-body text-fog lg:col-span-4 lg:col-start-9">
            <InlineRichText field={p.intro} />
          </div>
        )}
      </Reveal>
      <ul
        tabIndex={0}
        aria-label="Foto's, sleep of scroll opzij"
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-[var(--gap)] overflow-x-auto px-[var(--margin)] [scroll-padding-inline:var(--margin)] lg:mt-16"
      >
        {images.map((image, i) => (
          <li
            key={i}
            className={`relative shrink-0 snap-start overflow-hidden bg-navy ${
              i % 3 === 0 ? "aspect-[4/5] h-[58svh]" : "aspect-[3/2] h-[58svh]"
            } max-h-[34rem] max-sm:h-[44svh]`}
          >
            <Img
              field={image}
              fill
              sizes="(min-width: 1920px) 960px, (min-width: 640px) 50vw, 90vw"
              className="object-cover"
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Gallery;
