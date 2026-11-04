import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { CarGallery } from "@/components/CarGallery";
import { Section } from "@/components/Section";
import { SectionHeading } from "@/components/SectionHeading";

export type GalleryProps = SliceComponentProps<Content.GallerySlice>;

const Gallery = ({ slice }: GalleryProps) => {
  const p = slice.primary;
  const images = p.images.map((i) => i.image).filter((i) => i?.url);
  const title = p.title.map((n) => ("text" in n ? n.text : "")).join(" ") || "Galerij";

  return (
    <Section slice={slice} tone="Donker">
      <div className="container-x">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} intro={p.intro} dark />
        <div className="mx-auto mt-12 max-w-5xl">
          <CarGallery images={images} title={title} />
        </div>
      </div>
    </Section>
  );
};

export default Gallery;
