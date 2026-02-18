import { page } from "$app/state";
import { redirect, type HandleClientError } from "@sveltejs/kit";

export const handleError: HandleClientError = ({ status, message }) => {
  if (status === 401) {
    redirect(302, `/.auth/login/aad?post_login_redirect_uri=${page.url}`); // Redirect to Azure AD login
  }
  else {
    return { message }
  }
}
