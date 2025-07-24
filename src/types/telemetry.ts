export interface Telemetry {
  latency: string;
  packet_loss: string;
  throughput: string;
}

// make sure this is exported
export async function getTelemetry(): Promise<Telemetry> {
  const res = await fetch(import.meta.env.VITE_TELEMETRY_API_URL + '/api/v1/telemetry/network', {
    headers: { 'X-API-Key': import.meta.env.VITE_TELEMETRY_API_KEY }
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}
