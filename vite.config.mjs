// vite.config.mjs
import { defineConfig } from 'vite';
import { svelte }         from '@sveltejs/vite-plugin-svelte';

// dynamically load the ESM-only svelte-preprocess
const { default: sveltePreprocess } = await import('svelte-preprocess');

export default defineConfig({
  plugins: [
    svelte({
      // strip TS syntax but don’t type-check at build time
      preprocess: sveltePreprocess({ typescript: { transpileOnly: true } })
    })
  ]
});
