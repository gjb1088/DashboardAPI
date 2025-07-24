// vite.config.ts
import { defineConfig }     from 'vite';
import { svelte }           from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess     from 'svelte-preprocess';

export default defineConfig({
  plugins: [
    svelte({
      preprocess: sveltePreprocess({
        // ⚠️ skip all type-checking errors, just transpile TS → JS
        typescript: { transpileOnly: true }
      })
    })
  ]
});
