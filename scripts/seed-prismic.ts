/**
 * Pushes the bundled seed content to Prismic via the Migration API.
 *
 *   PRISMIC_WRITE_TOKEN=... npm run seed:prismic
 *     Creates every seed document that does not exist in Prismic yet.
 *
 *   PRISMIC_WRITE_TOKEN=... npm run seed:prismic -- --update=home,contact,settings
 *     Also overwrites the listed existing documents (by UID; "settings" for the
 *     settings document) with the seed version; --update=all overwrites every document. Documents that were edited in
 *     Prismic after their first publication are skipped unless --force is given.
 *
 *   --only=page,settings   Limit the run to these document types (page, car, settings).
 *   --dry-run              Print the plan without sending anything.
 *
 * Images are downloaded from the old site and uploaded once; images already in
 * the Prismic media library are reused by filename.
 * Everything lands in the "Migration release": review and publish it in Prismic.
 * Publish before running the script again: documents that are still in the
 * Migration release are not visible to it and would be created twice.
 */
import * as prismic from "@prismicio/client";

import config from "../slicemachine.config.json";
import { seedDocuments } from "../src/seed";

const writeToken = process.env.PRISMIC_WRITE_TOKEN;
if (!writeToken) {
  console.error("Set PRISMIC_WRITE_TOKEN to a Prismic write API token.");
  process.exit(1);
}

const SOURCE = "https://bvbautomotive.be/wp-content/uploads/";
const repositoryName = process.env.PRISMIC_REPOSITORY ?? config.repositoryName;
const args = process.argv.slice(2);
const arg = (name: string) =>
  (args.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3) ?? "").split(",").filter(Boolean);
const force = args.includes("--force");
const dryRun = args.includes("--dry-run");
const updateList = new Set(arg("update"));
const only = new Set(arg("only"));

const client = prismic.createClient(repositoryName);
const writeClient = prismic.createWriteClient(repositoryName, { writeToken });
const migration = prismic.createMigration();

type ExistingAsset = { id: string; filename: string; url: string } & Record<string, unknown>;

async function listAssets() {
  const assets = new Map<string, ExistingAsset>();
  let cursor: string | undefined;
  do {
    const url = new URL("https://asset-api.prismic.io/assets");
    url.searchParams.set("limit", "1000");
    if (cursor) url.searchParams.set("cursor", cursor);
    const res = await fetch(url, {
      headers: { repository: repositoryName, Authorization: `Bearer ${writeToken}` },
    });
    if (!res.ok) throw new Error(`Asset API: ${res.status} ${await res.text()}`);
    const body = (await res.json()) as { items: ExistingAsset[]; cursor?: string };
    for (const asset of body.items) assets.set(asset.filename, asset);
    cursor = body.items.length ? body.cursor : undefined;
  } while (cursor);
  return assets;
}

/** 2026/10/DSC07630.jpg → 2026-10-DSC07630.jpg, so equal names from different months never clash. */
const assetName = (url: string) => url.slice(SOURCE.length).replace(/\//g, "-");

const assetCache = new Map<string, prismic.PrismicMigrationAsset>();
/** Documents registered in this migration, by type:uid, for link resolution. */
const migrationDocs = new Map<string, prismic.PrismicMigrationDocument>();
let existingAssets = new Map<string, ExistingAsset>();
let uploads = 0;

function toMigration(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(toMigration);
  if (!value || typeof value !== "object") return value;

  const obj = value as Record<string, unknown>;

  // Seed image → existing asset (referenced by id) or a new upload from the old site
  if (typeof obj.url === "string" && obj.url.startsWith(SOURCE) && obj.dimensions) {
    const filename = assetName(obj.url);
    const existing = existingAssets.get(filename);
    if (existing) {
      return {
        id: existing.id,
        url: existing.url,
        alt: (obj.alt as string) || null,
        copyright: null,
        dimensions: obj.dimensions,
        edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
      };
    }
    let asset = assetCache.get(filename);
    if (!asset) {
      asset = migration.createAsset(obj.url, filename, { alt: (obj.alt as string) || undefined });
      assetCache.set(filename, asset);
      uploads++;
    }
    return asset;
  }

  // Seed document link → content relationship resolved once all documents exist
  if (obj.link_type === "Document" && typeof obj.uid === "string" && typeof obj.type === "string") {
    const { type, uid } = obj as { type: "page" | "car"; uid: string };
    return {
      link_type: "Document",
      id: () => migrationDocs.get(`${type}:${uid}`) ?? client.getByUID(type, uid).catch(() => undefined),
      ...(obj.text ? { text: obj.text } : {}),
    };
  }

  // Slices: drop the generated seed ids
  if (typeof obj.slice_type === "string") {
    return {
      slice_type: obj.slice_type,
      variation: obj.variation,
      primary: toMigration(obj.primary),
      items: toMigration(obj.items),
    };
  }

  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, toMigration(v)]));
}

function titleOf(doc: (typeof seedDocuments)[number]) {
  const data = doc.data as Record<string, unknown>;
  if (doc.type === "settings") return "Instellingen";
  if (doc.type === "car") return `${data.brand} ${data.model}${data.year ? ` (${data.year})` : ""}`;
  return String(data.title ?? doc.uid);
}

async function main() {
  existingAssets = await listAssets();
  const published = await client.dangerouslyGetAll();
  const key = (d: { type: string; uid?: string | null }) => `${d.type}:${d.uid ?? d.type}`;
  const existingDocs = new Map(published.map((d) => [key(d), d]));
  const docs = seedDocuments.filter((d) => !only.size || only.has(d.type));

  const created: string[] = [];
  const updated: string[] = [];
  const skipped: string[] = [];

  for (const doc of docs) {
    const id = doc.uid ?? doc.type;
    const existing = existingDocs.get(key(doc));

    if (!existing) {
      const migrated = migration.createDocument(
        {
          type: doc.type,
          uid: doc.uid ?? undefined,
          lang: published[0]?.lang ?? (await client.getRepository()).languages.find((l) => l.is_master)!.id,
          tags: [],
          data: toMigration(doc.data),
        } as Parameters<typeof migration.createDocument>[0],
        titleOf(doc),
      );
      migrationDocs.set(key(doc), migrated);
      created.push(id);
      continue;
    }

    if (!updateList.has(id) && !updateList.has("all")) continue;
    if (existing.first_publication_date !== existing.last_publication_date && !force) {
      skipped.push(`${id} (edited in Prismic; use --force to overwrite)`);
      continue;
    }
    const migrated = migration.updateDocument(
      { ...existing, data: toMigration(doc.data) } as Parameters<typeof migration.updateDocument>[0],
      titleOf(doc),
    );
    migrationDocs.set(key(doc), migrated);
    updated.push(id);
  }

  console.log(`Creating ${created.length}: ${created.join(", ") || "-"}`);
  console.log(`Updating ${updated.length}: ${updated.join(", ") || "-"}`);
  if (skipped.length) console.log(`Skipped: ${skipped.join(", ")}`);
  console.log(`Uploading ${uploads} new images; existing images are reused.`);

  if (dryRun || (!created.length && !updated.length)) return;

  await writeClient.migrate(migration, {
    reporter: (event) => {
      if (event.type === "end" || event.type.endsWith(":creating") || event.type.endsWith(":updating")) {
        const d = event.data as { current?: number; total?: number };
        if (event.type === "end" || d.current === d.total || (d.current ?? 0) % 25 === 0) {
          console.log(event.type, d.current ?? "", d.total ?? "");
        }
      }
    },
  });

  console.log(`\nDone. Review and publish the Migration release of "${repositoryName}" in Prismic.`);
}

main().catch((error) => {
  console.error(error);
  // Validation errors from the Migration API name the offending fields.
  const details = (error as { response?: { details?: unknown } }).response?.details;
  if (details) console.error(JSON.stringify(details, null, 2));
  process.exit(1);
});
