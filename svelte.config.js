// svelte.config.js
import sveltePreprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/vite-plugin-svelte').SvelteKitConfig} */
export default {
  preprocess: sveltePreprocess({
    typescript: {
      transpileOnly: true
    }
  })
};
