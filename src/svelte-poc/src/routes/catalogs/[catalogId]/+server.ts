import { db } from "$lib/db.svelte";
import getUserId from "$lib/getUserId";
import { error, type RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ params, platform }) => {
  const userid = getUserId(platform);
  const { catalogId } = params;
  if (!catalogId) error(400);
  await db.deleteCatalog(userid, catalogId);
  return new Response();
};