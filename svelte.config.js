// svelte.config.js
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Use the same tsconfig settings
  preprocess: preprocess(),

  kit: {
    adapter: adapter({
      // these folders are relative to project root
      pages: 'build',
      assets: 'build',
      fallback: null
    }),
    // if hosting at a sub-path, set base here
    paths: {
      base: ''
    }
  }
};

export default config;

