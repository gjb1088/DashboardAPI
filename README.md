# Neuro // Telemetry

[![CI](https://github.com/gjb1088/DashboardAPI/actions/workflows/ci.yml/badge.svg)](https://github.com/gjb1088/DashboardAPI/actions/workflows/ci.yml)

A neon, 8-bit style dashboard for checking live network telemetry from the NeuroDevOps stack from anywhere: latency, packet loss and throughput, refreshed every 10 seconds.

**Live:** https://api.burnthe.network

![Dashboard showing latency, packet loss and throughput cards with sparklines](docs/screenshot.png)
<sub>Screenshot uses simulated data.</sub>

## Features

- **Live polling** every 10s, with pause/resume. Polling stops while the tab is in the background and catches up when you return.
- **Health at a glance.** Each metric turns cyan, amber or red against thresholds in [`src/lib/metrics.ts`](src/lib/metrics.ts).
- **Sparklines** of the last 60 readings, plus values that count up to each new reading.
- **Key kept server-side.** A Cloudflare Pages Function adds the API key to each request, so it never reaches the browser or the public bundle.
- **Clear failures.** Timeouts, rejected keys and network errors are shown on the page as terminal-style messages.
- Responsive down to phone width, and honours `prefers-reduced-motion`.

## How it works

```
browser ──▶ /api/telemetry ──X-API-Key──▶ telemetry.burnthe.network/api/v1/telemetry/network ──▶ NeuroDevOps
            (Pages Function,               (Cloudflare → Caddy → FastAPI)
             holds the secret)
```

The endpoint returns JSON with `latency` (ms), `packet_loss` (%) and `throughput` (Mbps, shown as Gbps). The proxy lives in [`functions/api/telemetry.ts`](functions/api/telemetry.ts); in `npm run dev` the Vite dev server plays the same role.

## Run locally

```bash
npm install
cp .env.example .env   # then set TELEMETRY_API_KEY for the dev proxy
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run check` | Type-check with svelte-check |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build |

### Configuration

| Variable | Default | Notes |
| --- | --- | --- |
| `TELEMETRY_API_KEY` | _(none, required)_ | Sent as `X-API-Key` by the proxy. Store it as a **Secret** in Cloudflare Pages |
| `TELEMETRY_API_BASE` | `https://telemetry.burnthe.network` | Base URL only; the `/api/v1/...` path is added in code |

Set both under the Pages project's **Settings → Variables and secrets** for Production and Preview. Never prefix them with `VITE_`: Vite compiles those into the public JavaScript, even when stored as a Secret.

## Deployment

Cloudflare Pages builds `main` to production at `api.burnthe.network` and gives every branch its own preview URL. [`.github/workflows/ci.yml`](.github/workflows/ci.yml) type-checks and builds each pull request and push to `main`.

Because the browser only talks to its own origin, the API needs no CORS rules for the dashboard.

## Stack

Svelte 4 · TypeScript · Vite · Press Start 2P + JetBrains Mono
