import { error, type RequestHandler } from "@sveltejs/kit";
import { db } from "$lib/db.svelte";

export const DELETE: RequestHandler = async ({ params }) => {
  const { ideaId } = params;
  if (!ideaId) error(400);
  await db.deleteIdea(ideaId);
  return new Response();
};