import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Preprocessing is picked up from svelte.config.js
export default defineConfig({
  // Set by CI so asset URLs resolve under the GitHub Pages /<repo>/ path
  base: process.env.BASE_PATH || '/',
  plugins: [svelte()]
});
