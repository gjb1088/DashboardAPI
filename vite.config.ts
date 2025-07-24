import { sveltekit } from '@sveltejs/kit/vite';
import preprocess from 'svelte-preprocess';

/** @type {import('vite').UserConfig} */
export default {
  plugins: [
    sveltekit({
      preprocess: preprocess()
    })
  ]
};
