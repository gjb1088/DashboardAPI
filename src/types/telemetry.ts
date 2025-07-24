export interface Telemetry {
  latency:    string;
  packet_loss:string;
  throughput: string;
}

export async function getTelemetry(): Promise<Telemetry> {
  const url = import.meta.env.VITE_TELEMETRY_API_URL;
  const key = import.meta.env.VITE_TELEMETRY_API_KEY;

  const res = await fetch(url, {
    headers: { 'X-API-Key': key }
  });
  if (!res.ok) throw new Error(`API returned ${res.status}`);
  return res.json();
}
