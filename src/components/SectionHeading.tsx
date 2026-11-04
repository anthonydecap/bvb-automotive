import type { RichTextField } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { ReactNode } from "react";

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

/**
 * A section's title and its intro. "split" sets the title across seven columns and the intro
 * beside it, so the heading never leaves the right half of the screen empty.
 */
export function SectionHeading({
  title,
  intro,
  dark,
  align = "left",
  children,
  as = "h2",
}: SectionHeadingProps) {
  const hasIntro = isFilled.richText(intro) || children;
  if (!isFilled.richText(title) && !hasIntro) return null;
  const muted = dark ? "text-fog" : "";

  if (align === "split" && hasIntro) {
    return (
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
        <Title field={title} as={as} className="heading lg:col-span-7" />
        <div className={`space-y-4 text-body lg:col-span-4 lg:col-start-9 ${muted}`}>
          <InlineRichText field={intro} />
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <Title field={title} as={as} className="heading" />
      {hasIntro && (
        <div className={`mt-6 max-w-2xl space-y-4 text-body ${muted}`}>
          <InlineRichText field={intro} />
          {children}
        </div>
      )}
    </div>
  );
}
