import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Preprocessing is picked up from svelte.config.js
export default defineConfig({
  plugins: [svelte()]
});
