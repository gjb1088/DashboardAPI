import preprocess from 'svelte-preprocess';

/** @type {import('svelte').Config} */
const config = {
  preprocess: preprocess({
    // skip full type‐checking; just strip TS syntax
    typescript: {
      transpileOnly: true
    }
  })
};

export default config;
