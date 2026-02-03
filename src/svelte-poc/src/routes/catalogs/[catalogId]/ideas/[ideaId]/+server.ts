import { error, type RequestHandler } from "@sveltejs/kit";
import { db } from "$lib/server/db.svelte";
import getUserId from "$lib/server/getUserId";

export const DELETE: RequestHandler = async ({ params, platform }) => {
  const userId = getUserId(platform);
  const { ideaId } = params;
  if (!ideaId) error(400);
  await db.deleteIdea(userId, ideaId);
  return new Response();
};