import { error, type RequestEvent } from "@sveltejs/kit";

export default function getUserId(platform?: Readonly<App.Platform>) {
  if (import.meta.env.DEV) {
    return '80630cd5734740f29a0d4832bbf1d860';
  }
  else {
    return platform?.clientPrincipal?.userId ?? error(401);
  }
}