import type { Telemetry } from '../types/telemetry';

// Same-origin proxy (functions/api/telemetry.ts) that adds the API key server-side
export const TELEMETRY_URL = '/api/telemetry';

export class TelemetryError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'TelemetryError';
  }
}

export async function getTelemetry(signal?: AbortSignal): Promise<Telemetry> {
  let res: Response;
  try {
    res = await fetch(TELEMETRY_URL, { signal });
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err;
    throw new TelemetryError(`NO LINK // ${TELEMETRY_URL} unreachable (offline?)`);
  }

  if (!res.ok) {
    const text = (await res.text()).slice(0, 200);
    throw new TelemetryError(`${res.status} ${res.statusText} // ${text}`, res.status);
  }

  const json = (await res.json()) as Record<string, unknown>;
  return {
    latency:     toNumber(json.latency, 'latency'),
    packet_loss: toNumber(json.packet_loss, 'packet_loss'),
    throughput:  toNumber(json.throughput, 'throughput')
  };
}

function toNumber(value: unknown, field: string): number {
  const n = typeof value === 'number' ? value : parseFloat(String(value));
  if (!Number.isFinite(n)) throw new TelemetryError(`BAD DATA // ${field}=${String(value)}`);
  return n;
}
