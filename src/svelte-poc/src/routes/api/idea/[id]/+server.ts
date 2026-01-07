import { error, type RequestHandler } from "@sveltejs/kit";
import { ideas } from '$lib/data.svelte';
import { db } from "$lib/db.svelte";

export const DELETE: RequestHandler = async ({ params }) => {
  const id = params.id
  if (!id) error(400);
  await db.deleteIdea(id);
  return new Response();
};