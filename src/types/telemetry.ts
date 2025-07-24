// src/types/telemetry.ts

export type Telemetry = {
  latency: string;
  packet_loss: string;
  throughput: string;
};

export async function getTelemetry(
  endpoint: string,
  apiKey: string
): Promise<Telemetry> {
  const res = await fetch(endpoint, {
    headers: { 'X-API-Key': apiKey }
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}
