import type { Content, LinkField } from "@prismicio/client";
import { asLink, isFilled } from "@prismicio/client";

import { linkResolver } from "./routes";

export type Settings = Content.SettingsDocument;

export type NavLink = { label: string; href: string; external?: boolean };
export type NavGroup = NavLink & { children: NavLink[] };

export function href(field: LinkField | null | undefined): string | undefined {
  if (!field || !isFilled.link(field)) return undefined;
  return asLink(field, { linkResolver }) ?? undefined;
}

export const isExternal = (url: string | undefined) => !!url && /^https?:/.test(url);

/** The menu from Settings: "Submenu" items belong to the main item above them. */
export function navigation(settings: Settings): NavGroup[] {
  const groups: NavGroup[] = [];
  for (const item of settings.data.navigation) {
    const url = href(item.link);
    if (!url || !item.label) continue;
    const link = { label: item.label, href: url, external: isExternal(url) };
    if (item.level === "Submenu" && groups.length) groups.at(-1)!.children.push(link);
    else groups.push({ ...link, children: [] });
  }
  return groups;
}

/** Contact details from Settings, in the shape the components use. */
export function siteInfo(settings: Settings) {
  const s = settings.data;
  return {
    name: s.site_name ?? "BVB Automotive",
    phone: s.phone ?? "",
    whatsapp: s.whatsapp || s.phone || "",
    email: s.email ?? "",
    street: s.street ?? "",
    city: s.city ?? "",
    mapsHref: href(s.maps_link),
    contacts: s.contacts.filter((c) => c.name && c.phone) as { name: string; phone: string }[],
    hours: s.opening_hours.filter((h) => h.days) as { days: string; hours: string | null }[],
    hoursNote: s.hours_note,
    instagram: href(s.instagram),
    facebook: href(s.facebook),
    rating: s.rating,
    ratingSource: s.rating_source,
    reviewsHref: href(s.reviews_link),
    vatNumber: s.vat_number,
  };
}

export type SiteInfo = ReturnType<typeof siteInfo>;
