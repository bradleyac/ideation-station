import { db } from "$lib/server/db.svelte";
import getUserId from "$lib/server/getUserId";
import { error } from "console";

export const actions = {
  updateCatalog: async (event) => {
    const userId = getUserId(event.platform);

    const data = await event.request.formData();
    const name = data.get('name')?.toString() ?? '';
    const desc = data.get('desc')?.toString() ?? '';

    if (name === '' || desc === '') error(400);

    await db.updateCatalog(userId, { id: event.params.catalogId, name, desc });
  },
  loadConnections: async (event) => {
    const userId = getUserId(event.platform);

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
      await db.createIdea(userId, event.params.catalogId, { id, name: word, desc: word });
    }
  }
};