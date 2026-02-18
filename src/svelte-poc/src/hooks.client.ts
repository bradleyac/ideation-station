import { redirect } from "@sveltejs/kit";

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