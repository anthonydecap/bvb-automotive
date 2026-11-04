import type { ImageField } from "@prismicio/client";
import { asImageSrc, isFilled } from "@prismicio/client";
import type { Metadata } from "next";

import { getSettings } from "./content";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bvbautomotive.be";

export function imageUrl(field: ImageField | null | undefined) {
  if (!field || !isFilled.image(field)) return undefined;
  return field.url.includes("images.prismic.io")
    ? (asImageSrc(field, { width: 1200, height: 630, fit: "crop" }) ?? undefined)
    : field.url;
}

type Meta = {
  title?: string | null;
  description?: string | null;
  image?: ImageField | null;
  path: string;
  /** Use the title as is, without the site name. */
  absolute?: boolean;
  type?: "website" | "article";
};

export async function buildMetadata({ title, description, image, path, absolute, type = "website" }: Meta): Promise<Metadata> {
  const settings = await getSettings();
  const siteName = settings.data.site_name ?? "BVB Automotive";
  const fullTitle = absolute || !title ? (title ?? siteName) : `${title} · ${siteName}`;
  const desc = description || settings.data.meta_description || undefined;
  const img = imageUrl(image) ?? imageUrl(settings.data.meta_image);

  return {
    title: fullTitle,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description: desc,
      siteName,
      type,
      locale: "nl_BE",
      url: path,
      images: img ? [{ url: img }] : undefined,
    },
    twitter: { card: "summary_large_image" },
  };
}
