import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { redirect } from "@sveltejs/kit";

export default function getUserId() {
  if (import.meta.env.DEV) {
    return env.ME; // me!
  }
  else {
    const event = getRequestEvent();
    const userId = event.platform?.clientPrincipal?.userId;
    // TODO: This is only ever called on the server and I don't think it could ever get 
    // here because SWA would prevent unauthenticated requests.
    // Does this serve any purpose or even work? Is it necessary or misleading to have this?
    if (userId) {
      return userId;
    }
    else {
      redirect(302, `/.auth/login/aad?post_login_redirect_uri=${event.url}`); // Redirect to Azure AD login
    }
  }
}