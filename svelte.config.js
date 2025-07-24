// svelte.config.js
import preprocess from 'svelte-preprocess';

export default {
  // Tell Svelte to preprocess TS (and you can add PostCSS, SCSS, etc. here too)
  preprocess: preprocess(),

  // You can leave out `kit` entirely for a plain Vite+Svelte setup
};
