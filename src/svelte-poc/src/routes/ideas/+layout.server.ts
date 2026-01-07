import { db } from "$lib/db.svelte";

export async function load({ depends, params }) {
  depends("data:ideas");
  return {
    ideas: await db.getAllIdeas()
  }
}