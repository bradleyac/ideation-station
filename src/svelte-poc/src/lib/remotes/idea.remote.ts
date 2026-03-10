import { command, form, query } from "$app/server";
import { db } from "$lib/server/db.svelte";
import getUserId from "$lib/server/getUserId";
import { error } from "@sveltejs/kit";
import * as v from 'valibot';
import { getCategoryIdeaIds } from "./category.remote";

export const getIdeaIds = query(v.string(), async (catalogId) => {
  const userId = getUserId();

  const ideaIds = await db.getAllIdeaIds(userId, catalogId);

  // await new Promise((resolve) => setTimeout(resolve, 3000));

  return ideaIds;
});

export const getRelatedIdeaIds = query(v.string(), async (ideaId) => {
  const userId = getUserId();

  const ideaIds = await db.getRelatedIdeaIds(userId, ideaId);
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  return ideaIds;
});

export const getUnrelatedIdeaIds = query(v.string(), async (ideaId) => {
  const userId = getUserId();

  const ideaIds = await db.getUnrelatedIdeaIds(userId, ideaId);
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  return ideaIds;
});

export const getIdea = query.batch(v.string(), async (ideaIds) => {
  const userId = getUserId();

  const ideas = await db.getIdeasByIds(userId, ideaIds);
  const lookup = new Map(ideas.map((c => [c.id, c])));

  return (ideaId) => lookup.get(ideaId);
});

export const updateIdea = command(v.object({
  id: v.string(),
  name: v.string(),
  desc: v.string(),
  categoryId: v.string()
}), async (idea) => {
  const userId = getUserId();

  await db.updateIdea(userId, idea);

  getIdea(idea.id).refresh();
})

export const deleteIdea = command(v.object({
  id: v.string(),
  otherId: v.optional(v.string())
}), async ({ id, otherId }) => {
  const userId = getUserId();

  await db.deleteIdea(userId, id);

  if (otherId) {
    getRelatedIdeaIds(otherId).refresh();
    getUnrelatedIdeaIds(otherId).refresh();
  }
})

export const upsertIdea = form(v.object({
  id: v.optional(v.string()),
  name: v.string(),
  desc: v.string(),
  categoryId: v.string(),
  catalogId: v.string(),
}), async (idea) => {
  const userId = getUserId();

  if (idea.id) {
    let toUpdate = { ...idea, id: idea.id! };
    await db.updateIdea(userId, toUpdate)
    getIdea(idea.id).set(toUpdate);
  }
  else {
    const id = crypto.randomUUID();
    await db.createIdea(userId, idea.catalogId, { ...idea, id });
    getIdeaIds(idea.catalogId).refresh();
    if (idea.categoryId) {
      getCategoryIdeaIds(idea.categoryId).refresh();
    }
  }
})

export const setCategory = command(v.object({
  id: v.string(),
  categoryId: v.string(),
}), async (idea) => {
  const userId = getUserId();
  if (!idea.id || !idea.categoryId) error(400);
  await db.changeIdeaCategory(userId, idea.id, idea.categoryId);
});

export const unlinkIdea = command(v.object({
  id: v.string(),
  otherId: v.string()
}), async ({ id, otherId }) => {
  const userId = getUserId();
  if (!id || !otherId || id === otherId) error(400);
  await Promise.all([db.removeRelation(userId, id, otherId), db.removeRelation(userId, otherId, id)]);
  getRelatedIdeaIds(id).refresh();
  getRelatedIdeaIds(otherId).refresh();
  getUnrelatedIdeaIds(id).refresh();
  getUnrelatedIdeaIds(otherId).refresh();
});

export const linkIdea = command(v.object({
  id: v.string(),
  otherId: v.string()
}), async ({ id, otherId }) => {
  const userId = getUserId();
  if (!id || !otherId || id === otherId) error(400);
  await db.addRelation(userId, id, otherId);
  getRelatedIdeaIds(id).refresh();
  getRelatedIdeaIds(otherId).refresh();
  getUnrelatedIdeaIds(id).refresh();
  getUnrelatedIdeaIds(otherId).refresh();
});