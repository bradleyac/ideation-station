import { command, getRequestEvent, query } from "$app/server";
import { db } from "$lib/server/db.svelte";
import getUserId from "$lib/server/getUserId";
import * as v from 'valibot';

export const getIdeaIds = query(v.string(), async (catalogId) => {
  const event = getRequestEvent();
  const userId = getUserId(event.platform);

  const ideaIds = await db.getAllIdeaIds(userId, catalogId);

  return ideaIds;
});

export const getCategoryIdeaIds = query(v.string(), async (categoryId) => {
  const event = getRequestEvent();
  const userId = getUserId(event.platform);

  const ideaIds = await db.getCategoryIdeaIds(userId, categoryId);

  return ideaIds;
});

export const getRelatedIdeaIds = query(v.string(), async (ideaId) => {
  const event = getRequestEvent();
  const userId = getUserId(event.platform);

  const ideaIds = await db.getRelatedIdeaIds(userId, ideaId);

  return ideaIds;
});

export const getUnrelatedIdeaIds = query(v.string(), async (ideaId) => {
  const event = getRequestEvent();
  const userId = getUserId(event.platform);

  const ideaIds = await db.getUnrelatedIdeaIds(userId, ideaId);

  return ideaIds;
});

export const getIdea = query.batch(v.string(), async (ideaIds) => {
  const event = getRequestEvent();
  const userId = getUserId(event.platform);

  const ideas = await db.getIdeasByIds(userId, ideaIds);
  const lookup = new Map(ideas.map((c => [c.id, c])));

  return (ideaId) => lookup.get(ideaId);
});

export const updateIdea = command(v.object({
  id: v.string(),
  name: v.string(),
  desc: v.string(),
  categoryId: v.optional(v.string())
}), async (idea) => {
  const event = getRequestEvent();
  const userId = getUserId(event.platform);

  await db.updateIdea(userId, idea);

  getIdea(idea.id).refresh();
})

export const deleteIdea = command(v.string(), async (ideaId) => {
  const event = getRequestEvent();
  const userId = getUserId(event.platform);

  await db.deleteIdea(userId, ideaId);
})