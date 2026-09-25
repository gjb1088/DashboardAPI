const STORAGE_KEY = 'telemetry-api-key';
const ENV_KEY = import.meta.env.VITE_TELEMETRY_API_KEY ?? '';

// A key typed into the app stays in this browser only, unlike a VITE_ env
// var which is compiled into the public bundle.
export function loadApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || ENV_KEY;
  } catch {
    return ENV_KEY;
  }
}

export function saveApiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch {
    // Storage unavailable (private mode); the key lasts for this page load
  }
}

export function clearApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing stored to clear
  }
}
