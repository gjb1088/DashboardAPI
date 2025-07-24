import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte({
      preprocess: require('svelte-preprocess')({
        // only strip TS syntax—no type-checking
        typescript: { transpileOnly: true }
      })
    })
  ]
});
