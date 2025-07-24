// plain Vite + Svelte needs this so `<script lang="ts">` works
import preprocess from 'svelte-preprocess';

/** @type {import('svelte').Config} */
export default {
  preprocess: preprocess({
    typescript: {
      // only strip TS – don’t type-check
      transpileOnly: true
    }
  })
};
