// svelte.config.js
import sveltePreprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/vite-plugin-svelte').SvelteKitConfig} */
export default {
  preprocess: sveltePreprocess({
    typescript: {
      // your tsconfig file (defaults to tsconfig.json)
      tsconfigFile: './tsconfig.json'
    }
  })
};
