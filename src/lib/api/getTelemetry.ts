import type { Telemetry } from '../types/telemetry';

export async function getTelemetry(
  url: string,
  apiKey: string
): Promise<Telemetry> {
  const res = await fetch(url, { headers: { "X-API-Key": apiKey } });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
}
