import { db } from "$lib/db.svelte";

export async function load({ depends, params }) {
  depends("data:ideas");
  console.log(process.env);
  return {
    ideas: await db.getAllIdeas()
  }
}