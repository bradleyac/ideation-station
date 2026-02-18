import { db } from "$lib/server/db.svelte";
import getUserId from "$lib/server/getUserId";

export const actions = {
  loadConnections: async (event) => {
    const userId = getUserId();

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