import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { PageView } from "@/components/PageView";
import { getAllDocuments, getPage } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

/** /werkplaats → page "werkplaats"; /werkplaats/schroefsets → page "schroefsets" (with parent). */
async function resolve(path: string[]) {
  const uid = path.at(-1);
  if (!uid || uid === "home" || path.length > 2) return undefined;
  const page = await getPage(uid);
  return page ? { page, expected: page.url ?? `/${uid}` } : undefined;
}

export async function generateStaticParams() {
  const docs = await getAllDocuments();
  return docs
    .filter((d) => d.type === "page" && d.uid !== "home" && d.url)
    .map((d) => ({ path: d.url!.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: PageProps<"/[...path]">): Promise<Metadata> {
  const { path } = await params;
  const found = await resolve(path);
  if (!found) return {};
  const { page, expected } = found;
  return buildMetadata({
    title: page.data.meta_title || page.data.title,
    description: page.data.meta_description,
    image: page.data.meta_image,
    path: expected,
  });
}

export default async function Page({ params }: PageProps<"/[...path]">) {
  const { path } = await params;
  const found = await resolve(path);
  if (!found) notFound();
  // A page reached under the wrong parent goes to its real address.
  const current = `/${path.join("/")}`;
  if (decodeURIComponent(current) !== found.expected) permanentRedirect(found.expected);
  return <PageView page={found.page} />;
}
