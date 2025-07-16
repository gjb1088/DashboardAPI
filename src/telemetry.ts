export interface NetTelemetry {
  timestamp:       number;
  latency_ms:      number;
  packet_loss_pct: number;
  throughput_mbps: number;
  jitter_ms?:      number | null;
}

export async function fetchNetworkTelemetry(): Promise<NetTelemetry> {
  const apiUrl = import.meta.env.VITE_TELEMETRY_API_URL;
  const apiKey = import.meta.env.VITE_TELEMETRY_API_KEY;
  const res = await fetch(`${apiUrl}/api/v1/telemetry/network`, {
    headers: { 'X-API-Key': apiKey }
  });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const { latency, packet_loss, throughput, jitter } = await res.json();
  return {
    timestamp:       Date.now(),
    latency_ms:      parseFloat(latency),
    packet_loss_pct: parseFloat(packet_loss),
    throughput_mbps: parseFloat(throughput),
    jitter_ms:       jitter != null ? parseFloat(jitter) : null
  };
}
