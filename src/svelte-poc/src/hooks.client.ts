import { page } from "$app/state";
import { redirect, type HandleClientError } from "@sveltejs/kit";

const native_fetch = window.fetch;

export function init() {
  window.fetch = (req, init) => {
    if (req instanceof Request) {
      if (!req.headers.get('StaticWebAppsAuthCookie')) {
        redirect(302, '/.auth/login/aad?post_login_redirect_uri=.referrer'); // Redirect to Azure AD login
      }
    }
    return native_fetch(req, init);
  };
}

export const handleError: HandleClientError = ({ status, message }) => {
  if (status === 401) {
    redirect(302, `/.auth/login/aad?post_login_redirect_uri=${page.url}`); // Redirect to Azure AD login
  }
  else {
    return { message }
  }
}
