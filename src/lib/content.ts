import type { Content } from "@prismicio/client";
import { filter } from "@prismicio/client";

import { createClient } from "@/prismicio";
import { seedDocuments } from "@/seed";

import { sortCars } from "./cars";

/**
 * Content access. Prismic is the source of truth. Until the repository has
 * any published document, the bundled seed content is served instead so the
 * site is never empty (e.g. before the first migration release is published).
 * PRISMIC_USE_SEED=true forces the seed content, for local previews only.
 */

type Client = ReturnType<typeof createClient>;

async function servesSeed(client: Client) {
  if (process.env.PRISMIC_USE_SEED === "true") return true;
  // Errors are not treated as "empty": an outage must never put the seed copy online.
  const res = await client.get({ pageSize: 1 });
  return res.total_results_size === 0;
}

function seedOf<T extends Content.AllDocumentTypes["type"]>(type: T) {
  return seedDocuments.filter((d) => d.type === type) as unknown as Extract<
    Content.AllDocumentTypes,
    { type: T }
  >[];
}

export async function getSettings(): Promise<Content.SettingsDocument> {
  const client = createClient();
  if (await servesSeed(client)) return seedOf("settings")[0];
  return client.getSingle("settings");
}

export async function getPage(uid: string) {
  const client = createClient();
  if (await servesSeed(client)) return seedOf("page").find((d) => d.uid === uid);
  return client.getByUID("page", uid).catch(() => undefined);
}

export async function getCar(uid: string) {
  const client = createClient();
  if (await servesSeed(client)) return seedOf("car").find((d) => d.uid === uid);
  return client.getByUID("car", uid).catch(() => undefined);
}

/** Every car, available first. */
export async function getCars() {
  const client = createClient();
  const cars = (await servesSeed(client)) ? seedOf("car") : await client.getAllByType("car");
  return sortCars(cars);
}

/** Every page and car, for static generation and the sitemap. */
export async function getAllDocuments() {
  const client = createClient();
  const docs = (await servesSeed(client))
    ? [...seedOf("page"), ...seedOf("car")]
    : await client.dangerouslyGetAll({ filters: [filter.any("document.type", ["page", "car"])] });
  return docs as (Content.PageDocument | Content.CarDocument)[];
}
