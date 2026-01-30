import { db } from "$lib/db.svelte";
import { dev } from "$app/environment";
import { error, redirect } from "@sveltejs/kit";
import getUserId from "$lib/getUserId";

export async function load({ depends, params, platform }) {
  depends("data:ideas");
  const userid = getUserId(platform);

  // TODO: Does this work at all? It doesn't prevent the 500.
  if (!dev) {
    if (!platform?.clientPrincipal) {
      redirect(302, '/.auth/login/aad');
    }
  }

  return {
    ideas: await db.getAllIdeas(userid, params.catalogId),
    categories: await db.getAllCategories(userid, params.catalogId),
  }
}