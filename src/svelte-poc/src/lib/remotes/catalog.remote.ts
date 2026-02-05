import { command, getRequestEvent, query } from "$app/server";
import { db } from "$lib/server/db.svelte";
import getUserId from "$lib/server/getUserId";
import * as v from 'valibot';

export const getCatalogIds = query(async () => {
  const event = getRequestEvent();
  const userId = getUserId(event.platform);

  const catalogIds = await db.getAllCatalogIds(userId);

  return catalogIds;
});

export const getCatalog = query.batch(v.string(), async (catalogIds) => {
  const event = getRequestEvent();
  const userId = getUserId(event.platform);

  const catalogs = await db.getCatalogsByIds(userId, catalogIds);
  const lookup = new Map(catalogs.map((c => [c.id, c])));

  return (catalogId) => lookup.get(catalogId);
});

export const updateCatalog = command(v.object({
  id: v.string(),
  name: v.string(),
  desc: v.string(),
  settings: v.object({
    connections: v.boolean()
  })
}), async (catalog) => {
  const event = getRequestEvent();
  const userId = getUserId(event.platform);

  await db.updateCatalog(userId, catalog);

  getCatalog(catalog.id).refresh();
})