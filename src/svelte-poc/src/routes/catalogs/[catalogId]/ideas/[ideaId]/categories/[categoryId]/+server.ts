import { db } from "$lib/server/db.svelte";
import getUserId from "$lib/server/getUserId";
import { error, type RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ params, platform }) => {
  const userId = getUserId();
  const { ideaId, categoryId } = params;
  if (!ideaId || !categoryId) error(400);
  await db.removeCategoryFromIdea(userId, ideaId, categoryId);
  return new Response();
};

export const PUT: RequestHandler = async ({ params, platform }) => {
  const userId = getUserId();
  const { ideaId, categoryId } = params;
  if (!ideaId || !categoryId) error(400);
  await db.changeIdeaCategory(userId, ideaId, categoryId);
  return new Response();
}