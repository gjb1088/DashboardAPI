import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const config = {
  preprocess: preprocess({ typescript: true }),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null
    }),
    // if your site is rooted at a sub‐path, set `paths.base`
    paths: {
      base: ''
    }
  }
};

export default config;
