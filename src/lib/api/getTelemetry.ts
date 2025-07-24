import type { Telemetry } from '../types/telemetry';

export async function getTelemetry(
  baseUrl: string,
  apiKey: string
): Promise<Telemetry> {
  const res = await fetch(`${baseUrl}/api/v1/telemetry/network`, {
    headers: { 'X-API-Key': apiKey }
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return (await res.json()) as Telemetry;
}
