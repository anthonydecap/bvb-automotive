import type { LinkField } from "@prismicio/client";
import { isFilled } from "@prismicio/client";

import { ArrowRight } from "./Icons";
import { PrismicLink } from "./PrismicLink";

type Button = { label?: string | null; link: LinkField; style?: string | null };

/**
 * Buttons from a Prismic "Knoppen" group. The first primary is the gold button; a secondary
 * becomes a plain underlined link, so a screen never carries two filled actions side by side.
 */
export function ButtonRow({
  buttons,
  className = "",
  primary = "btn-gold",
}: {
  buttons: Button[];
  className?: string;
  primary?: string;
}) {
  const filled = buttons.filter((b) => isFilled.link(b.link));
  if (!filled.length) return null;
  return (
    <div className={`flex flex-wrap items-center gap-x-8 gap-y-4 ${className}`}>
      {filled.map((b, i) =>
        b.style === "Secundair" || i > 0 ? (
          <PrismicLink key={i} field={b.link} className="link font-medium">
            {b.label || b.link.text}
          </PrismicLink>
        ) : (
          <PrismicLink key={i} field={b.link} className={`btn ${primary}`}>
            {b.label || b.link.text}
            <ArrowRight size={18} className="arrow" />
          </PrismicLink>
        ),
      )}
    </div>
  );
}
