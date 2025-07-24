// src/types/telemetry.ts

export type Telemetry = {
  latency: string;
  packet_loss: string;
  throughput: string;
};

export async function getTelemetry(
  url: string,
  apiKey: string
): Promise<Telemetry> {
  const response = await fetch(url, {
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Error ${response.status}`);
  }
  return response.json() as Promise<Telemetry>;
}
