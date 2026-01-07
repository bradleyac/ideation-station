import { db } from '$lib/db.svelte.js';
import { error } from '@sveltejs/kit';

export async function load({ depends, params }) {
  depends("data:ideas");
  const idea = await db.getIdea(params.id);
  const relatedIdeas = await db.getRelatedIdeas(params.id);

  if (!idea) error(404);

  return {
    idea,
    relatedIdeas,
    title: idea.name
  };
}

export const actions = {
  addRelation: async (event) => {
    let body = await event.request.json();
    const { otherId } = body;
    if (!otherId) error(400);
    db.addRelation(event.params.id, otherId);
  },
  removeRelation: async (event) => {
    let body = await event.request.json();
    const { otherId } = body;
    if (!otherId) error(400);
    db.removeRelation(event.params.id, otherId);
  }
}