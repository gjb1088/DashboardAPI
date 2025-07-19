// svelte.config.js
import sveltePreprocess from 'svelte-preprocess';

export default {
  preprocess: sveltePreprocess({
    typescript: {
      transpileOnly: true
    }
  })
};
