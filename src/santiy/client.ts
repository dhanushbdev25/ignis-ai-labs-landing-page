import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "5moen2qt",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});