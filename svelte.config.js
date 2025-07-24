import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

export default {
  preprocess: preprocess({
    typescript: {
      // skip all type-checking and just compile
      transpileOnly: true
    }
  }),

  kit: {
    adapter: adapter(),
    // ...any other kit settings you had
  }
};
