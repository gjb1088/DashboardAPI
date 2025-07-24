// vite.config.js
import { defineConfig } from 'vite';
import { svelte }        from '@sveltejs/vite-plugin-svelte';
import { resolve }       from 'path';

export default defineConfig({
  plugins: [svelte()],
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'src/App.svelte')
    }
  }
});
