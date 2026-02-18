import { redirect } from "@sveltejs/kit";

const native_fetch = window.fetch;

export async function init() {
  window.fetch = async (req, init) => {
    const result = await native_fetch(req, init);
    if (result.status === 401) {
      redirect(302, '/.auth/login/aad?post_login_redirect_uri=.referrer'); // Redirect to Azure AD login
    }
    return result;
  };
}