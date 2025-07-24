import preprocess from 'svelte-preprocess';

/** @type {import('svelte').Config} */
export default {
  preprocess: preprocess({
    // Only strip TS syntax—don’t enforce types
    typescript: { transpileOnly: true }
  })
};
