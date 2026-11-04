/**
 * Pushes the custom types (customtypes/) and slices (src/slices/) to Prismic
 * through the Custom Types API, creating or updating each one.
 *
 *   PRISMIC_WRITE_TOKEN=... npm run push:models
 *
 * The same can be done by hand with Slice Machine (npm run slicemachine).
 */
import fs from "node:fs";
import path from "node:path";

import config from "../slicemachine.config.json";

const token = process.env.PRISMIC_WRITE_TOKEN;
if (!token) {
  console.error("Set PRISMIC_WRITE_TOKEN to a Prismic write API token.");
  process.exit(1);
}
const repository = process.env.PRISMIC_REPOSITORY ?? config.repositoryName;
const api = "https://customtypes.prismic.io";
const headers = { repository, Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

async function request(method: string, url: string, body?: unknown) {
  const res = await fetch(`${api}${url}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error(`${method} ${url}: ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json().catch(() => null);
}

async function push(kind: "customtypes" | "slices", models: { id: string }[]) {
  const existing = new Set(((await request("GET", `/${kind}`)) as { id: string }[]).map((m) => m.id));
  for (const model of models) {
    const action = existing.has(model.id) ? "update" : "insert";
    await request("POST", `/${kind}/${action}`, model);
    console.log(`${kind} ${model.id}: ${action === "insert" ? "created" : "updated"}`);
  }
}

function readModels(dir: string, file: string) {
  return fs
    .readdirSync(dir)
    .filter((name) => fs.existsSync(path.join(dir, name, file)))
    .map((name) => JSON.parse(fs.readFileSync(path.join(dir, name, file), "utf8")));
}

async function main() {
  // Slices first: custom types refer to them.
  await push("slices", readModels("src/slices", "model.json"));
  await push("customtypes", readModels("customtypes", "index.json"));
  console.log(`\nModels of "${repository}" are up to date.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
