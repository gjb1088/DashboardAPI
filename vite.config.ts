import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import svelteConfig from './svelte.config.js';

export default defineConfig({
  plugins: [
    svelte({
      // merge in the preprocess step
      preprocess: svelteConfig.preprocess
    })
  ]
});
