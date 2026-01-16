import { db } from "$lib/db.svelte";
import { error, type RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ params }) => {
  const { ideaId, categoryId } = params;
  if (!ideaId || !categoryId) error(400);
  await db.removeCategoryFromIdea(ideaId, categoryId);
  return new Response();
};

export const PUT: RequestHandler = async ({ params }) => {
  const { ideaId, categoryId } = params;
  if (!ideaId || !categoryId) error(400);
  await db.addCategoryToIdea(ideaId, categoryId);
  return new Response();
}