import type { MetadataRoute } from "next";

import { getAllDocuments } from "@/lib/content";
import { siteUrl } from "@/lib/metadata";
import { carPath } from "@/lib/routes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await getAllDocuments();
  return docs.map((doc) => {
    const path = doc.type === "car" ? carPath(doc.uid) : (doc.url ?? `/${doc.uid}`);
    return {
      url: `${siteUrl}${path === "/" ? "" : path}`,
      lastModified: new Date(doc.last_publication_date),
      changeFrequency: doc.type === "car" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : doc.type === "car" && doc.data.status !== "Verkocht" ? 0.8 : 0.6,
    };
  });
}
