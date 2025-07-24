import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

export default {
  preprocess: preprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',    // output dir that Pages will serve
      assets: 'build',
      fallback: null
    }),
    paths: {
      base: ''          // keep empty unless you need a sub-directory
    }
  }
};
