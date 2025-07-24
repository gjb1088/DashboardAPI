import { defineConfig } from 'vite';
import { svelte }       from '@sveltejs/vite-plugin-svelte';
import preprocess       from 'svelte-preprocess';

export default defineConfig({
  plugins: [
    svelte({
      preprocess: preprocess({
        // just transpile TS → JS, skip type-checking
        typescript: { transpileOnly: true }
      })
    })
  ]
});
