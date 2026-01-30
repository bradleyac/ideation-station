import { db } from "$lib/db.svelte";
import getUserId from "$lib/getUserId";
import { error, type RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ params, platform }) => {
  const userid = getUserId(platform);
  const { categoryId } = params;
  if (!categoryId) error(400);
  await db.deleteCategory(userid, categoryId);
  return new Response();
};