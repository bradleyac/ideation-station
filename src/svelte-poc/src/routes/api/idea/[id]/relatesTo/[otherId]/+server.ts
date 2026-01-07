import { error, type RequestHandler } from "@sveltejs/kit";
import { db } from "$lib/db.svelte";

export const DELETE: RequestHandler = async ({ params }) => {
  const id = params.id
  const otherId = params.otherId;
  if (!id || !otherId || id === otherId) error(400);
  await db.removeRelation(id, otherId);
  await db.removeRelation(otherId, id);
  return new Response();
};

export const PUT: RequestHandler = async ({ params }) => {
  const { id, otherId } = params;
  if (!id || !otherId || id === otherId) error(400);
  await db.addRelation(id, otherId);
  return new Response();
}