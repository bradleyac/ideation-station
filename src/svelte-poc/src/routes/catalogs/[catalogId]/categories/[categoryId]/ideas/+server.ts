import { db } from "$lib/server/db.svelte";
import getUserId from "$lib/server/getUserId";
import { error, type RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ params, platform }) => {
  const userId = getUserId(platform);
  const { categoryId, catalogId } = params;
  if (!categoryId || !catalogId) error(400);
  if (categoryId === 'Uncategorized') {
    await db.deleteUncategorizedIdeas(userId, catalogId)
  }
  else {
    await db.deleteCategoryIdeas(userId, categoryId);
  }
  return new Response();
};