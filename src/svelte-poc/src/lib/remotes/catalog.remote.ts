import { command, form, getRequestEvent, query } from "$app/server";
import { db } from "$lib/server/db.svelte";
import getUserId from "$lib/server/getUserId";
import * as v from 'valibot';

export const getCatalogIds = query(async () => {
  const event = getRequestEvent();
  const userId = getUserId();

  const catalogIds = await db.getAllCatalogIds(userId);

  return catalogIds;
});

export const getCatalog = query.batch(v.string(), async (catalogIds) => {
  const event = getRequestEvent();
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
  const event = getRequestEvent();
  const userId = getUserId();

  await db.deleteCatalog(userId, catalogId);
  getCatalogIds().refresh();
});