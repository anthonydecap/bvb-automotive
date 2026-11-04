import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageView } from "@/components/PageView";
import { getPage } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("home");
  if (!page) return {};
  return buildMetadata({
    title: page.data.meta_title,
    description: page.data.meta_description,
    image: page.data.meta_image,
    path: "/",
    absolute: true,
  });
}

export default async function Home() {
  const page = await getPage("home");
  if (!page) notFound();
  return <PageView page={page} />;
}
