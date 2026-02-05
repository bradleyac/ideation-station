import { command, getRequestEvent, query } from "$app/server";
import { db } from "$lib/server/db.svelte";
import getUserId from "$lib/server/getUserId";
import * as v from 'valibot';

export const getCategoryIdeaIds = query(v.string(), async (categoryId) => {
  const event = getRequestEvent();
  const userId = getUserId(event.platform);

  const ideaIds = await db.getCategoryIdeaIds(userId, categoryId);

  return ideaIds;
});


export const getCategoryIds = query(v.string(), async (catalogId) => {
  const event = getRequestEvent();
  const userId = getUserId(event.platform);

  const categoryIds = await db.getAllCategoryIds(userId, catalogId);

  return categoryIds;
});

export const getAllCategoryMetadata = query(v.string(), async (catalogId) => {
  const event = getRequestEvent();
  const userId = getUserId(event.platform);

  const categoryIds = await db.getAllCategoryMetadata(userId, catalogId);

  return categoryIds;
});

export const getCategory = query.batch(v.string(), async (categoryIds) => {
  const event = getRequestEvent();
  const userId = getUserId(event.platform);

  const categories = await db.getCategoriesByIds(userId, categoryIds);
  const lookup = new Map(categories.map((c => [c.id, c])));

  return (categoryId) => lookup.get(categoryId);
});

export const updateCategory = command(v.object({
  id: v.string(),
  name: v.string(),
  desc: v.string(),
}), async (category) => {
  const event = getRequestEvent();
  const userId = getUserId(event.platform);

  await db.updateCategory(userId, { ...category, ideaIds: [] });

  getCategory(category.id).refresh();
})

export const deleteCategory = command(v.object({ catalogId: v.string(), categoryId: v.string() }), async ({ catalogId, categoryId }) => {
  const event = getRequestEvent();
  const userId = getUserId(event.platform);

  await db.deleteCategory(userId, categoryId);

  getCategory(categoryId).refresh();
  getCategoryIds(catalogId).refresh();
})