import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // enable TypeScript, SCSS, PostCSS, etc.
  preprocess: vitePreprocess(),

  kit: {
    // build into the "build" folder (matches your Pages output setting)
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      // for a SPA fallback, you could use: fallback: 'index.html'
      fallback: null
    }),

    // no base path
    paths: {
      base: ''
    }
  }
};

export default config;
