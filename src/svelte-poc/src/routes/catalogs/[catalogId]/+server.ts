import { db } from "$lib/server/db.svelte";
import getUserId from "$lib/server/getUserId";
import { error, type RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ params, platform }) => {
  const userId = getUserId();
  const { catalogId } = params;
  if (!catalogId) error(400);
  await db.deleteCatalog(userId, catalogId);
  return new Response();
};