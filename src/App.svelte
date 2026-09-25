<script lang="ts">
  import { onMount } from 'svelte';
  import MetricCard from './lib/components/MetricCard.svelte';
  import { METRICS } from './lib/metrics';
  import type { Telemetry } from './lib/types/telemetry';
  import { getTelemetry, TelemetryError, TELEMETRY_URL } from './lib/api/getTelemetry';

  const POLL_MS = 10_000;
  const TIMEOUT_MS = 8_000;
  const HISTORY_LEN = 60;

  let telemetry: Telemetry | null = null;
  let history: Telemetry[] = [];
  let live = true;
  let loading = false;
  let error: string | null = null;
  let lastSync: number | null = null;
  let now = Date.now();
  let pollTimer: ReturnType<typeof setTimeout>;

  async function refresh() {
    if (loading) return;
    loading = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      telemetry = await getTelemetry(controller.signal);
      history = [...history, telemetry].slice(-HISTORY_LEN);
      lastSync = Date.now();
      error = null;
    } catch (err) {
      if (err instanceof TelemetryError && (err.status === 401 || err.status === 403)) {
        error = 'ACCESS DENIED // check the TELEMETRY_API_KEY secret';
      } else if ((err as Error).name === 'AbortError') {
        error = `TIMEOUT // no response in ${TIMEOUT_MS / 1000}s`;
      } else {
        error = (err as Error).message;
      }
    } finally {
      clearTimeout(timeout);
      loading = false;
    }
  }

  // Chain timeouts rather than setInterval so slow responses never overlap
  function schedule() {
    clearTimeout(pollTimer);
    if (live && !document.hidden) pollTimer = setTimeout(tick, POLL_MS);
  }

  async function tick() {
    await refresh();
    schedule();
  }

  function refreshNow() {
    clearTimeout(pollTimer);
    tick();
  }

  function toggleLive() {
    live = !live;
    if (live) refreshNow();
    else clearTimeout(pollTimer);
  }

  // Stop polling in background tabs and catch up when the tab comes back
  function onVisibilityChange() {
    if (document.hidden) clearTimeout(pollTimer);
    else if (live) refreshNow();
  }

  onMount(() => {
    const clock = setInterval(() => (now = Date.now()), 1000);
    document.addEventListener('visibilitychange', onVisibilityChange);
    tick();
    return () => {
      clearInterval(clock);
      clearTimeout(pollTimer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  });

  $: status = error ? 'fault' : !live ? 'paused' : 'live';
  $: ago = lastSync === null ? null : Math.max(0, Math.round((now - lastSync) / 1000));
</script>

<div class="floor" aria-hidden="true"></div>
<div class="scanlines" aria-hidden="true"></div>

<main>
  <header class="hud">
    <h1 class="title">Neuro<span class="slash">//</span>Telemetry</h1>
    <p class="status {status}" role="status">
      <span class="dot"></span>
      <span class="state">{status}</span>
      {#if ago !== null}<span class="sync">sync {ago}s ago</span>{/if}
    </p>
  </header>

  {#if error}
    <p class="terminal-error" role="alert">
      <span class="prompt">&gt;</span> ERR {error}<span class="cursor" aria-hidden="true">▌</span>
    </p>
  {/if}

  <section class="cards">
    {#each METRICS as def (def.key)}
      <MetricCard
        {def}
        value={telemetry ? telemetry[def.key] : null}
        history={history.map((h) => h[def.key])} />
    {/each}
  </section>

  <footer class="controls">
    <button class="btn primary" on:click={refreshNow} disabled={loading}>
      {loading ? 'Syncing…' : 'Refresh'}
    </button>
    <button class="btn" on:click={toggleLive} aria-pressed={!live}>
      {live ? 'Pause' : 'Resume'}
    </button>
  </footer>

  <p class="endpoint">{TELEMETRY_URL} · every {POLL_MS / 1000}s</p>
</main>

<style>
  :global(:root) {
    --bg: #07010f;
    --panel: rgba(10, 4, 26, 0.86);
    --text: #ece9ff;
    --dim: #7b78a8;
    --cyan: #00f0ff;
    --magenta: #ff2bd6;
    --violet: #b04dff;
    --amber: #ffb300;
    --red: #ff3b5c;
    --font-pixel: 'Press Start 2P', monospace;
    --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
    color-scheme: dark;
  }

  :global(body) {
    margin: 0;
    min-height: 100vh;
    font-family: var(--font-mono);
    color: var(--text);
    background:
      radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255, 43, 214, 0.22), transparent 70%),
      radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0, 240, 255, 0.12), transparent 70%),
      var(--bg);
  }

  :global(*),
  :global(*::before),
  :global(*::after) {
    box-sizing: border-box;
  }

  /* Synthwave perspective grid */
  .floor {
    position: fixed;
    inset: auto 0 0 0;
    height: 42vh;
    z-index: -1;
    overflow: hidden;
    perspective: 320px;
    perspective-origin: 50% 0;
    mask-image: linear-gradient(to top, #000 20%, transparent);
    -webkit-mask-image: linear-gradient(to top, #000 20%, transparent);
    pointer-events: none;
  }
  .floor::before {
    content: '';
    position: absolute;
    left: -100%;
    right: -100%;
    bottom: 0;
    height: 300%;
    transform: rotateX(78deg);
    transform-origin: bottom center;
    background-image:
      linear-gradient(rgba(255, 43, 214, 0.55) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 43, 214, 0.55) 1px, transparent 1px);
    background-size: 56px 56px;
    animation: floor 3s linear infinite;
  }
  @keyframes floor {
    to { background-position: 0 56px; }
  }

  .scanlines {
    position: fixed;
    inset: 0;
    z-index: 10;
    pointer-events: none;
    background: repeating-linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.025) 0 1px,
      transparent 1px 3px
    );
  }

  main {
    max-width: 960px;
    margin: 0 auto;
    padding: clamp(1.5rem, 5vw, 3rem) 16px 4rem;
  }

  .hud {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .title {
    margin: 0;
    font-family: var(--font-pixel);
    font-size: clamp(0.95rem, 3.2vw, 1.4rem);
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    background: linear-gradient(90deg, var(--magenta), var(--violet) 50%, var(--cyan));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    filter: drop-shadow(0 0 8px rgba(255, 43, 214, 0.45));
  }
  .slash {
    margin: 0 0.35em;
  }

  .status {
    --accent: var(--cyan);
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin: 0;
    font-size: 0.75rem;
    color: var(--dim);
  }
  .status.paused { --accent: var(--amber); }
  .status.fault { --accent: var(--red); }
  .state {
    font-family: var(--font-pixel);
    font-size: 0.55rem;
    text-transform: uppercase;
    color: var(--accent);
    text-shadow: 0 0 6px var(--accent);
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
  }
  .status.live .dot {
    animation: pulse 1.6s ease-in-out infinite;
  }
  @keyframes pulse {
    50% { opacity: 0.3; }
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 1.25rem;
  }

  .prompt {
    color: var(--cyan);
  }

  .terminal-error {
    margin: 0 0 1.5rem;
    padding: 0.8rem 1rem;
    font-size: 0.85rem;
    color: var(--red);
    background: rgba(255, 59, 92, 0.08);
    border-left: 2px solid var(--red);
    overflow-wrap: anywhere;
  }
  .cursor {
    animation: blink 1s steps(1) infinite;
  }
  @keyframes blink {
    50% { opacity: 0; }
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 2rem;
  }

  .btn {
    padding: 0.85rem 1.2rem;
    font-family: var(--font-pixel);
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--cyan);
    background: rgba(0, 240, 255, 0.04);
    border: 1px solid var(--cyan);
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    cursor: pointer;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s;
  }
  .btn:hover:not(:disabled) {
    background: rgba(0, 240, 255, 0.16);
    box-shadow: 0 0 16px rgba(0, 240, 255, 0.5);
    transform: translateY(-1px);
  }
  .btn:focus-visible {
    outline: 2px solid var(--magenta);
    outline-offset: 2px;
  }
  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .btn.primary {
    color: #07010f;
    background: linear-gradient(90deg, var(--magenta), var(--cyan));
    border: none;
  }
  .btn.primary:hover:not(:disabled) {
    background: linear-gradient(90deg, #ff5ce0, #5cf6ff);
  }

  .endpoint {
    margin: 1.5rem 0 0;
    font-size: 0.72rem;
    color: var(--dim);
  }

  @media (prefers-reduced-motion: reduce) {
    :global(*),
    :global(*::before),
    :global(*::after) {
      animation: none !important;
      transition: none !important;
    }
  }
</style>
