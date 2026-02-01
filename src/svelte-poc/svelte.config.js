import azure from 'svelte-adapter-azure-swa';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		experimental: {
			async: true
		}
	},
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: azure({
			customStaticWebAppConfig: {
				routes: [
					{
						route: '/catalogs/*',
						allowedRoles: ['authenticated'],
						rewrite: "/api/sk_render"
					},
				],
				responseOverrides: {
					401: {
						statusCode: 302,
						"redirect": "/.auth/login/aad?post_login_redirect_uri=.referrer",
					}
				},
			}
		}),
		experimental: {
			tracing: {
				server: true
			},
			instrumentation: {
				server: true
			}
		}
	}
};

export default config;
