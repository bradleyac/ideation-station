import { db } from "$lib/db.svelte";
import getUserId from "$lib/getUserId";
import { error } from "console";

export async function load({ depends, params, platform }) {
  depends(`data:catalog/${params.catalogId}`);
  const userid = getUserId(platform);
  const catalog = await db.getCatalog(userid, params.catalogId);

  if (!catalog) error(404);

  return {
    catalog: catalog,
    title: `Catalog: ${catalog.name}`
  };
}

export const actions = {
  updateCatalog: async (event) => {
    const userid = getUserId(event.platform);

    const data = await event.request.formData();
    const name = data.get('name')?.toString() ?? '';
    const desc = data.get('desc')?.toString() ?? '';

    if (name === '' || desc === '') error(400);

    await db.updateCatalog(userid, { id: event.params.catalogId, name, desc });
  },
  loadConnections: async (event) => {
    const userid = getUserId(event.platform);

    async function loadConnections() {
      const today = new Date();
      const formatted = today.toISOString().slice(0, 10);
      const connectionsUrl = `https://www.nytimes.com/svc/connections/v2/${formatted}.json`;
      const json = await (await fetch(connectionsUrl, { method: 'GET', referrer: '' })).json();

      const result = json.categories.map((cat: any) => cat.cards.map((c: any) => c.content)).reduce((acc: any, el: any) => [...acc, ...el]).toSorted();
      return result;
    }

    const result = await loadConnections();

    for (let word of result) {
      const id = crypto.randomUUID();
      await db.createIdea(userid, event.params.catalogId, { id, name: word, desc: word });
    }
  }
};