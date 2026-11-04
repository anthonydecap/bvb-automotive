import type { ImageField } from "@prismicio/client";

import { Img } from "./Img";

/** A slow drift of car photographs, edge to edge. */
export function PhotoStrip({ images, className = "" }: { images: ImageField[]; className?: string }) {
  if (images.length < 4) return null;
  return (
    <div className={`strip ${className}`} aria-hidden="true">
      <div className="strip-track">
        {[...images, ...images].map((image, i) => (
          <div key={i}>
            <Img field={image} alt="" fill sizes="13rem" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
