import type { RichTextField } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { ReactNode } from "react";

import { Reveal } from "./Reveal";
import { InlineRichText, Title } from "./RichText";

type SectionHeadingProps = {
  /** Kept for the CMS model; small labels above headings are not shown. */
  eyebrow?: string | null;
  title: RichTextField | null | undefined;
  intro?: RichTextField | null;
  dark?: boolean;
  align?: "left" | "split";
  children?: ReactNode;
  as?: "h1" | "h2";
};

/** A section's title in the speed type, its intro beside it ("split") or under it. */
export function SectionHeading({ title, intro, align = "split", children, as = "h2" }: SectionHeadingProps) {
  const hasIntro = isFilled.richText(intro) || children;
  if (!isFilled.richText(title) && !hasIntro) return null;

  if (align === "split") {
    return (
      <Reveal className="sec-head">
        <Title field={title} as={as} className="speed head" />
        {hasIntro && (
          <div className="lead space-y-4 text-mist">
            <InlineRichText field={intro} />
            {children}
          </div>
        )}
      </Reveal>
    );
  }

  return (
    <Reveal className="max-w-4xl">
      <Title field={title} as={as} className="speed text-[clamp(1.5rem,1rem+1.6vw,2.6rem)]" />
      {hasIntro && (
        <div className="lead mt-6 max-w-[40ch] space-y-4 text-mist">
          <InlineRichText field={intro} />
          {children}
        </div>
      )}
    </Reveal>
  );
}
