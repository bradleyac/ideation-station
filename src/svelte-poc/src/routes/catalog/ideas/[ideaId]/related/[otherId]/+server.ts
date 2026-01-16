import { error, type RequestHandler } from "@sveltejs/kit";
import { db } from "$lib/db.svelte";

export const DELETE: RequestHandler = async ({ params }) => {
  const id = params.ideaId;
  const otherId = params.otherId;
  if (!id || !otherId || id === otherId) error(400);
  await db.removeRelation(id, otherId);
  await db.removeRelation(otherId, id);
  return new Response();
};

export const PUT: RequestHandler = async ({ params }) => {
  const { ideaId, otherId } = params;
  if (!ideaId || !otherId || ideaId === otherId) error(400);
  await db.addRelation(ideaId, otherId);
  return new Response();
}