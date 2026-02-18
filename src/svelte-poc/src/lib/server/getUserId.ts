import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { error, redirect } from "@sveltejs/kit";

export default function getUserId(platform?: Readonly<App.Platform>, redirectIfNotAuthenticated: boolean = true) {
  if (false/*import.meta.env.DEV*/) {
    return env.ME; // me!
  }
  else {
    const userId = platform?.clientPrincipal?.userId;
    if (userId) {
      return userId;
    }
    else {
      if (redirectIfNotAuthenticated) {
        const event = getRequestEvent();
        redirect(302, `/.auth/login/aad?post_login_redirect_uri=${event.url}`); // Redirect to Azure AD login
      }
      else {
        throw error(401, 'Unauthorized');
      }
    }
  }
}