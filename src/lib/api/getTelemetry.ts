import type { Telemetry } from '../types/telemetry';

export async function getTelemetry(
  url: string,
  apiKey: string
): Promise<Telemetry> {
  const res = await fetch(url, {
    headers: { 'X-API-Key': apiKey }
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<Telemetry>;
}
