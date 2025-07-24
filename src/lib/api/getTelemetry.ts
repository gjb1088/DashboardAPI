import type { Telemetry } from '$lib/types/telemetry';

export async function getTelemetry(): Promise<Telemetry> {
  const url = import.meta.env.VITE_TELEMETRY_API_URL;
  const key = import.meta.env.VITE_TELEMETRY_API_KEY;
  const res = await fetch(url, {
    headers: { 'X-API-Key': key }
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Fetch failed (${res.status}): ${txt}`);
  }
  return res.json();
}
