import type { Telemetry } from '../types/telemetry';

const API_URL = import.meta.env.VITE_TELEMETRY_API_URL
  ?? 'https://telemetry.burnthe.network/api/v1/telemetry/network';

export async function getTelemetry(): Promise<Telemetry> {
  const res = await fetch(API_URL, {
    headers: {
      'X-API-Key': import.meta.env.VITE_TELEMETRY_API_KEY ?? '',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Telemetry API error: ${res.status} – ${text}`);
  }
  return await res.json();
}
