import sveltePreprocess from 'svelte-preprocess';

/** @type {import('svelte').Config} */
export default {
  preprocess: sveltePreprocess({
    typescript: { transpileOnly: true }
  })
};
