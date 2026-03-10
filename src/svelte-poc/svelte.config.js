import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import azure from 'svelte-adapter-azure-swa';

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
		experimental: {
			remoteFunctions: true
		},
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
						"redirect": "/.auth/login/aad",
					}
				},
			}
		})
	}
};

export default config;
