import { getRequestEvent, query } from "$app/server";
import { db } from "$lib/server/db.svelte";
import getUserId from "$lib/server/getUserId";
import * as v from 'valibot';

export const getIdeas = query(v.string(), async (catalogId) => {
  const event = getRequestEvent();
  const userId = getUserId(event.platform);

  const ideas = await db.getAllIdeas(userId, catalogId);

  return ideas;
});

export const getIdea = query(v.string(), async (ideaId) => {
  const event = getRequestEvent();
  const userId = getUserId(event.platform);

  const idea = await db.getIdea(userId, ideaId);

  return idea;
});