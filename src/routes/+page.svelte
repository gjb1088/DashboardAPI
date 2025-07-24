import type { Telemetry } from '../types/telemetry';

const API_URL = import.meta.env.VITE_TELEMETRY_API_URL || 'https://telemetry.burnthe.network';
const API_KEY = import.meta.env.VITE_TELEMETRY_API_KEY || '0';

export async function getTelemetry(): Promise<Telemetry> {
  const res = await fetch(`${API_URL}/api/v1/telemetry/network`, {
    headers: { 'X-API-Key': API_KEY }
  });
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status}`);
  }
  return res.json();
}
