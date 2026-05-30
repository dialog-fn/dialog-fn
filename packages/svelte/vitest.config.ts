import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [svelte({ hot: false })],
	resolve: {
		// Resolve the browser build of Svelte when running component tests.
		conditions: ['browser']
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./vitest.setup.ts'],
		include: ['tests/unit/**/*.test.ts']
	}
});
