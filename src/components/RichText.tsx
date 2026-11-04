import type { RichTextField } from "@prismicio/client";
import { asLink, isFilled } from "@prismicio/client";
import { PrismicRichText, type JSXMapSerializer } from "@prismicio/react";
import type { ElementType } from "react";

import { linkResolver } from "@/lib/routes";

const components: JSXMapSerializer = {
  hyperlink: ({ node, children }) => {
    const url = asLink(node.data, { linkResolver }) ?? "#";
    const external = /^https?:/.test(url);
    return (
      <a href={url} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  },
};

type RichTextProps = {
  field: RichTextField | null | undefined;
  className?: string;
};

export function RichText({ field, className = "prose-bvb" }: RichTextProps) {
  if (!isFilled.richText(field)) return null;
  return (
    <div className={className}>
      <PrismicRichText field={field} components={components} />
    </div>
  );
}

/** Paragraph-only rich text without a wrapper, e.g. for intros. */
export function InlineRichText({ field }: { field: RichTextField | null | undefined }) {
  if (!isFilled.richText(field)) return null;
  return (
    <PrismicRichText
      field={field}
      components={{ ...components, paragraph: ({ children }) => <p>{children}</p> }}
    />
  );
}

type TitleProps = {
  field: RichTextField | null | undefined;
  as?: ElementType;
  className?: string;
};

/** A heading field. Italic spans from the CMS are set like the rest of the heading: one face, one colour. */
export function Title({ field, as: Tag = "h2", className = "" }: TitleProps) {
  if (!isFilled.richText(field)) return null;
  return (
    <PrismicRichText
      field={field}
      components={{
        heading1: ({ children }) => <Tag className={className}>{children}</Tag>,
        heading2: ({ children }) => <Tag className={className}>{children}</Tag>,
        heading3: ({ children }) => <Tag className={className}>{children}</Tag>,
        paragraph: ({ children }) => <Tag className={className}>{children}</Tag>,
        em: ({ children }) => <>{children}</>,
      }}
    />
  );
}
