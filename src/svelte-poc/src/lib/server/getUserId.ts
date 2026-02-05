import { env } from '$env/dynamic/private';
import { error } from "@sveltejs/kit";

export default function getUserId(platform?: Readonly<App.Platform>) {
  if (import.meta.env.DEV) {
    return env.ME; // me!
  }
  else {
    return platform?.clientPrincipal?.userId ?? error(401);
  }
}