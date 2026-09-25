/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TELEMETRY_API_BASE?: string;
  readonly VITE_TELEMETRY_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
