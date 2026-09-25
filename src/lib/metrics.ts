import type { Telemetry } from './types/telemetry';

export type Health = 'ok' | 'warn' | 'bad';

export interface MetricDef {
  key: keyof Telemetry;
  label: string;
  unit: string;
  decimals: number;
  higherIsBetter: boolean;
  /** Crossing `warn` marks the metric degraded, crossing `bad` marks it critical. */
  warn: number;
  bad: number;
}

// Thresholds are starting points; tune them to what's normal for the network.
export const METRICS: MetricDef[] = [
  { key: 'latency',     label: 'Latency',     unit: 'ms',   decimals: 1, higherIsBetter: false, warn: 50,  bad: 150 },
  { key: 'packet_loss', label: 'Packet Loss', unit: '%',    decimals: 2, higherIsBetter: false, warn: 0.5, bad: 2 },
  { key: 'throughput',  label: 'Throughput',  unit: 'Mbps', decimals: 1, higherIsBetter: true,  warn: 50,  bad: 10 }
];

export function healthOf(def: MetricDef, value: number): Health {
  if (def.higherIsBetter) return value <= def.bad ? 'bad' : value <= def.warn ? 'warn' : 'ok';
  return value >= def.bad ? 'bad' : value >= def.warn ? 'warn' : 'ok';
}
