import { defineConfig, loadEnv } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Preprocessing is picked up from svelte.config.js
export default defineConfig(({ mode }) => {
  // Unprefixed vars stay server-side; only the dev proxy sees the key
  const env = loadEnv(mode, process.cwd(), '');
  const base = (env.TELEMETRY_API_BASE || 'https://telemetry.burnthe.network').replace(/\/+$/, '');

  return {
    plugins: [svelte()],
    server: {
      // Mirrors functions/api/telemetry.ts for `npm run dev`
      proxy: {
        '/api/telemetry': {
          target: base,
          changeOrigin: true,
          rewrite: () => '/api/v1/telemetry/network',
          headers: env.TELEMETRY_API_KEY ? { 'X-API-Key': env.TELEMETRY_API_KEY } : {}
        }
      }
    }
  };
});
