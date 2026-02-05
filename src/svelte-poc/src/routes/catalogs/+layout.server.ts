import { dev } from "$app/environment";
import { db } from "$lib/server/db.svelte";
import getUserId from "$lib/server/getUserId";
import { redirect } from "@sveltejs/kit";

export async function load({ depends, params, platform }) {
  depends("data:catalogs");
  const userId = getUserId(platform);

  // TODO: Does this work at all? It doesn't prevent the 500.
  if (!dev) {
    if (!platform?.clientPrincipal) {
      redirect(302, '/.auth/login/aad');
    }
  }

  return {
    catalogs: await db.getAllCatalogs(userId),
  }
}