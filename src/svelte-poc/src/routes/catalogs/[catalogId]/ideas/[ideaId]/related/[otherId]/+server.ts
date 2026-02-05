import { db } from "$lib/server/db.svelte";
import getUserId from "$lib/server/getUserId";
import { error, type RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ params, platform }) => {
  const userId = getUserId(platform);
  const id = params.ideaId;
  const otherId = params.otherId;
  if (!id || !otherId || id === otherId) error(400);
  await db.removeRelation(userId, id, otherId);
  await db.removeRelation(userId, otherId, id);
  return new Response();
};

export const PUT: RequestHandler = async ({ params, platform }) => {
  const userId = getUserId(platform);
  const { ideaId, otherId } = params;
  if (!ideaId || !otherId || ideaId === otherId) error(400);
  await db.addRelation(userId, ideaId, otherId);
  return new Response();
}