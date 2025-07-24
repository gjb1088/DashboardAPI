import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Preprocess only strips TS syntax—no type‐checking
  preprocess: preprocess({
    typescript: {
      transpileOnly: true
    }
  }),
  kit: {
    // If you're using adapter-static, keep this; otherwise remove the kit block.
    adapter: (await import('@sveltejs/adapter-static')).default({
      pages: 'build',
      assets: 'build',
      fallback: null
    }),
    paths: {
      base: ''
    }
  }
};

export default config;
