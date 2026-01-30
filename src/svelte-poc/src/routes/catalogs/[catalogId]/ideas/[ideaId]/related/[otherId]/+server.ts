import { error, type RequestHandler } from "@sveltejs/kit";
import { db } from "$lib/db.svelte";
import getUserId from "$lib/getUserId";

export const DELETE: RequestHandler = async ({ params, platform }) => {
  const userid = getUserId(platform);
  const id = params.ideaId;
  const otherId = params.otherId;
  if (!id || !otherId || id === otherId) error(400);
  await db.removeRelation(userid, id, otherId);
  await db.removeRelation(userid, otherId, id);
  return new Response();
};

export const PUT: RequestHandler = async ({ params, platform }) => {
  const userid = getUserId(platform);
  const { ideaId, otherId } = params;
  if (!ideaId || !otherId || ideaId === otherId) error(400);
  await db.addRelation(userid, ideaId, otherId);
  return new Response();
}