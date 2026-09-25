// Cloudflare Pages Function: GET /api/telemetry
// Adds the API key server-side so it never reaches the browser, and keeps the
// request same-origin so the dashboard needs no CORS.

interface Env {
  TELEMETRY_API_KEY?: string;
  TELEMETRY_API_BASE?: string;
}

const DEFAULT_BASE = 'https://telemetry.burnthe.network';
const UPSTREAM_PATH = '/api/v1/telemetry/network';

export const onRequestGet = async ({ env }: { env: Env }): Promise<Response> => {
  if (!env.TELEMETRY_API_KEY) {
    return json(500, { detail: 'TELEMETRY_API_KEY secret is not configured' });
  }

  const base = (env.TELEMETRY_API_BASE || DEFAULT_BASE).replace(/\/+$/, '');
  let upstream: Response;
  try {
    upstream = await fetch(base + UPSTREAM_PATH, {
      headers: { 'X-API-Key': env.TELEMETRY_API_KEY, Accept: 'application/json' },
      signal: AbortSignal.timeout(7_000)
    });
  } catch (err) {
    const timedOut = (err as Error).name === 'TimeoutError';
    return json(timedOut ? 504 : 502, { detail: timedOut ? 'Upstream timed out' : 'Upstream unreachable' });
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
      'Cache-Control': 'no-store'
    }
  });
};

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}
