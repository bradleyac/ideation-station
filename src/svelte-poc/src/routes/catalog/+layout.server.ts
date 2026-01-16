import { db } from "$lib/db.svelte";
import { dev } from "$app/environment";
import { redirect } from "@sveltejs/kit";

export async function load({ depends, params, platform }) {
  depends("data:ideas");

  if (!dev) {
    if (!platform?.clientPrincipal) {
      redirect(302, '/.auth/login/aad');
    }
  }

  console.log("Platform info in layout.server.ts:", platform);

  return {
    ideas: await db.getAllIdeas(),
    categories: await db.getAllCategories(),
  }
}