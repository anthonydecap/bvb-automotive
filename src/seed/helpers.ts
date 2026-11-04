import type * as prismic from "@prismicio/client";

import { carPath } from "@/lib/routes";

import imageSizes from "./image-sizes.json";

/**
 * Helpers for authoring seed content in a compact form. The output has the
 * same shape as Prismic API responses, so it can be rendered directly and
 * pushed with `npm run seed:prismic`.
 */

const SOURCE = "https://bvbautomotive.be/wp-content/uploads/";

/** Seed pages that live under a parent page, by UID. */
export const pageParents: Record<string, string> = {
  "keramische-coating": "werkplaats",
  "service-herstelling": "werkplaats",
  uitlaatsystemen: "werkplaats",
  schroefsets: "werkplaats",
};

export function pagePath(uid: string) {
  if (uid === "home") return "/";
  return pageParents[uid] ? `/${pageParents[uid]}/${uid}` : `/${uid}`;
}

type Span = prismic.RTInlineNode;

function parseInline(input: string): { text: string; spans: Span[] } {
  const spans: Span[] = [];
  let text = "";
  const pattern = /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  for (const match of input.matchAll(pattern)) {
    text += input.slice(last, match.index);
    const start = text.length;
    if (match[1] !== undefined) {
      text += match[1];
      spans.push({ type: "strong", start, end: text.length } as Span);
    } else if (match[2] !== undefined) {
      text += match[2];
      spans.push({ type: "em", start, end: text.length } as Span);
    } else {
      text += match[3];
      const url = match[4];
      // [text](page:uid) links to another page document
      const data = url.startsWith("page:")
        ? doc("page", url.slice(5))
        : { link_type: "Web", url, ...(url.startsWith("http") ? { target: "_blank" } : {}) };
      spans.push({ type: "hyperlink", start, end: text.length, data } as Span);
    }
    last = match.index! + match[0].length;
  }
  text += input.slice(last);
  return { text, spans };
}

/** Rich text from lines. Prefixes: "## ", "### ", "- ", "1. ". Inline: **bold**, *em*, [text](url), [text](page:uid). */
export function rt(...blocks: string[]): prismic.RichTextField {
  return blocks.map((block) => {
    const rules: [RegExp, string][] = [
      [/^## /, "heading2"],
      [/^### /, "heading3"],
      [/^- /, "list-item"],
      [/^\d+\. /, "o-list-item"],
    ];
    for (const [re, type] of rules) {
      if (re.test(block)) {
        return { type, ...parseInline(block.replace(re, "")), direction: "ltr" } as prismic.RTNode;
      }
    }
    return { type: "paragraph", ...parseInline(block), direction: "ltr" } as prismic.RTNode;
  }) as prismic.RichTextField;
}

/** A single heading. *Text in asterisks* is shown in the gold accent colour. */
export function h(text: string): prismic.RichTextField {
  return [{ type: "heading2", ...parseInline(text), direction: "ltr" }] as prismic.RichTextField;
}

export type SeedImage = prismic.FilledImageFieldImage;

const sizes: Record<string, number[]> = imageSizes;

/** An image from the old site's media library, by its path under /wp-content/uploads/. */
export function img(file: string, alt: string, size?: [number, number]): SeedImage {
  const dims = size ?? sizes[file];
  if (!dims) throw new Error(`Unknown seed image: ${file}`);
  const [width, height] = dims;
  return {
    id: file,
    url: file.startsWith("http") ? file : `${SOURCE}${file}`,
    alt,
    copyright: null,
    dimensions: { width, height },
    edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
  };
}

export const noImage = {} as prismic.EmptyImageFieldImage;

/** Link to another document by UID. */
export function doc(type: "page" | "car", uid: string, text?: string): prismic.LinkField {
  return {
    link_type: "Document",
    id: `seed-${type}-${uid}`,
    uid,
    type,
    lang: "en-us",
    tags: [],
    slug: uid,
    isBroken: false,
    url: type === "car" ? carPath(uid) : pagePath(uid),
    ...(text ? { text } : {}),
  } as prismic.LinkField;
}

export function web(url: string, text?: string): prismic.LinkField {
  return {
    link_type: "Web",
    url,
    ...(url.startsWith("http") ? { target: "_blank" } : {}),
    ...(text ? { text } : {}),
  } as prismic.LinkField;
}

export const noLink = { link_type: "Any" } as prismic.LinkField;

/** Buttons field: [label, page uid] pairs; the first is primary, the rest secondary. */
export function buttons(...items: [string, string][]) {
  return items.map(([label, uid], i) => ({
    label,
    link: doc("page", uid),
    style: i === 0 ? "Primair" : "Secundair",
  }));
}

let sliceCount = 0;

export function slice<T extends string>(
  slice_type: T,
  primary: Record<string, unknown>,
  variation = "default",
) {
  sliceCount += 1;
  return {
    id: `${slice_type}$seed-${sliceCount}`,
    slice_type,
    slice_label: null,
    variation,
    version: "initial",
    primary,
    items: [],
  };
}

export function document<T extends string>(
  type: T,
  uid: string | null,
  data: Record<string, unknown>,
  date = "2026-11-04T09:00:00+0000",
) {
  return {
    id: `seed-${type}-${uid ?? type}`,
    uid,
    url: type === "car" && uid ? carPath(uid) : type === "page" && uid ? pagePath(uid) : null,
    type,
    href: "",
    tags: [],
    first_publication_date: date,
    last_publication_date: date,
    slugs: [],
    linked_documents: [],
    lang: "en-us",
    alternate_languages: [],
    data,
  };
}
