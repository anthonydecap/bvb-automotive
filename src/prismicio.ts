import * as prismic from "@prismicio/client";
import { CreateClientConfig, enableAutoPreviews } from "@prismicio/next";

import config from "../slicemachine.config.json";

export const repositoryName = process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || config.repositoryName;

/**
 * URL structure. Pages can have a parent page (/werkplaats/keramische-coating);
 * cars live under /aanbod.
 */
const routes: prismic.ClientConfig["routes"] = [
  { type: "page", uid: "home", path: "/" },
  { type: "page", path: "/:parent?/:uid", resolvers: { parent: "parent" } },
  { type: "car", path: "/aanbod/:uid" },
];

export function createClient(config: CreateClientConfig = {}) {
  const client = prismic.createClient(repositoryName, {
    routes,
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? // The publish webhook (/api/revalidate) refreshes immediately; the time limit is a safety net.
          { next: { tags: ["prismic"], revalidate: 300 } }
        : { next: { revalidate: 5 } },
    ...config,
  });

  enableAutoPreviews({ client });

  return client;
}
