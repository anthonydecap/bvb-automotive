import type { ImageField } from "@prismicio/client";

import { Img } from "./Img";

const ratios = ["aspect-[3/4]", "aspect-square", "aspect-[3/2]"];

/** A strip of small photographs that drifts sideways and runs off both edges. */
export function PhotoStrip({ images, className = "" }: { images: ImageField[]; className?: string }) {
  if (images.length < 4) return null;
  // Two copies, so the drift can loop without a seam.
  const loop = [...images, ...images];
  return (
    <div className={`photo-strip overflow-hidden ${className}`} aria-hidden="true">
      <div className="drift">
        {loop.map((image, i) => (
          <div
            key={i}
            className={`relative h-[110px] shrink-0 overflow-hidden bg-graphite sm:h-[150px] ${ratios[i % 3]}`}
          >
            <Img field={image} alt="" fill sizes="240px" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
