import { error, type RequestHandler } from "@sveltejs/kit";
import { db } from "$lib/db.svelte";
import getUserId from "$lib/getUserId";

export const DELETE: RequestHandler = async ({ params, platform }) => {
  const userid = getUserId(platform);
  const { ideaId } = params;
  if (!ideaId) error(400);
  await db.deleteIdea(userid, ideaId);
  return new Response();
};