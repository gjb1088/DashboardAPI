interface ImportMetaEnv {
  readonly VITE_TELEMETRY_API_URL: string;
  // add more VITE_ vars here if you need them
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
