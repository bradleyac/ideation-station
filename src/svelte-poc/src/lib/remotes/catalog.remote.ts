import { command, form, getRequestEvent, query } from "$app/server";
import { db } from "$lib/server/db.svelte";
import getUserId from "$lib/server/getUserId";
import * as v from 'valibot';
import { getCategoryIdeaIds } from "./category.remote";
import { getIdeaIds } from "./idea.remote";

export const getCatalogIds = query(async () => {
  const userId = getUserId();

  const catalogIds = await db.getAllCatalogIds(userId);

  return catalogIds;
});

export const getAllCatalogMetadata = query(async () => {
  const userId = getUserId();

  const categoryIds = await db.getAllCatalogMetadata(userId);

  return categoryIds;
});

export const getCatalog = query.batch(v.string(), async (catalogIds) => {
  const userId = getUserId();

  const catalogs = await db.getCatalogsByIds(userId, catalogIds);
  const lookup = new Map(catalogs.map((c => [c.id, c])));

  // await new Promise(resolve => setTimeout(resolve, 3000));

  return (catalogId) => lookup.get(catalogId);
});

export const upsertCatalog = form(v.object({
  id: v.optional(v.string()),
  name: v.string(),
  desc: v.string(),
  settings: v.optional(v.object({
    connections: v.boolean()
  }), { connections: false })
}), async (catalog) => {
  const event = getRequestEvent();
  const userId = getUserId();

  if (catalog.id) {
    let toUpdate = { ...catalog, id: catalog.id! };
    await db.updateCatalog(userId, toUpdate)
    getCatalog(catalog.id).set(toUpdate);
  }
  else {
    const id = crypto.randomUUID();
    await db.createCatalog(userId, { ...catalog, id });
    getCatalogIds().refresh();
  }
})

export const deleteCatalog = command(v.string(), async (catalogId) => {
  const userId = getUserId();

  await db.deleteCatalog(userId, catalogId);
  getCatalogIds().refresh();
});

export const loadConnections = form(v.object({
  catalogId: v.string()
}), async ({ catalogId }) => {
  const userId = getUserId();

  const today = new Date();
  const formatted = today.toISOString().slice(0, 10);
  const connectionsUrl = `https://www.nytimes.com/svc/connections/v2/${formatted}.json`;
  const json = await (await fetch(connectionsUrl, { method: 'GET', referrer: '' })).json();

  // TODO: This only works for strings. Sometimes they have SVGs.
  const result = json.categories.map((cat: any) => cat.cards.map((c: any) => c.content)).reduce((acc: any, el: any) => [...acc, ...el]).toSorted();
  const uncategorizedCategoryId = await db.getCatalogUncategorizedCategoryId(userId, catalogId);

  for (let word of result) {
    const id = crypto.randomUUID();
    await db.createIdea(userId, catalogId, { id, name: word, desc: word, categoryId: uncategorizedCategoryId });
  }

  getCategoryIdeaIds(uncategorizedCategoryId).refresh();
  getIdeaIds(catalogId).refresh();
});