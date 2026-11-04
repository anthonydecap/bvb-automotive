import type { LinkResolverFunction } from "@prismicio/client";

/** Path of a car detail page. */
export const carPath = (uid: string) => `/aanbod/${uid}`;

/**
 * Fallback for links without a resolved URL (the Content API resolves them
 * through the routes in prismicio.ts). Pages with a parent are resolved there.
 */
export const linkResolver: LinkResolverFunction = (doc) => {
  if (doc.url) return doc.url;
  if (doc.type === "car" && doc.uid) return carPath(doc.uid);
  if (doc.type === "page") return !doc.uid || doc.uid === "home" ? "/" : `/${doc.uid}`;
  return null;
};
