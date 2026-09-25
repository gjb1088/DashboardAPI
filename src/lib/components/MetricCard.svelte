<script lang="ts">
  import { onDestroy } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import Sparkline from './Sparkline.svelte';
  import { healthOf } from '../metrics';
  import type { Health, MetricDef } from '../metrics';

  export let def: MetricDef;
  export let value: number | null;
  export let history: number[] = [];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shown = tweened(0, { duration: reducedMotion ? 0 : 700, easing: cubicOut });

  const BADGES: Record<Health | 'idle', string> = { ok: 'Nominal', warn: 'Degraded', bad: 'Critical', idle: 'No signal' };

  let previous: number | null = null;
  let glitching = false;
  let glitchTimer: ReturnType<typeof setTimeout>;

  // Count up to each new reading, and glitch the label briefly when it moves
  function onValue(next: number | null) {
    if (next === null || next === previous) return;
    shown.set(next);
    if (previous !== null) {
      glitching = true;
      clearTimeout(glitchTimer);
      glitchTimer = setTimeout(() => (glitching = false), 600);
    }
    previous = next;
  }

  // Convert from the API's unit to the displayed one (e.g. Mbps → Gbps)
  $: shownValue = value === null ? null : value * (def.scale ?? 1);
  $: onValue(shownValue);
  let health: Health | 'idle';
  $: health = shownValue === null ? 'idle' : healthOf(def, shownValue);

  onDestroy(() => clearTimeout(glitchTimer));
</script>

<div class="shell {health}">
  <article class="card" class:glitching>
    <header>
      <h2 class="label" data-text={def.label}>{def.label}</h2>
      <span class="badge">{BADGES[health]}</span>
    </header>
    <p class="value">
      <span class="num">{shownValue === null ? '--' : $shown.toFixed(def.decimals)}</span>
      <span class="unit">{def.unit}</span>
    </p>
    <Sparkline values={history} />
  </article>
</div>

<style>
  .shell {
    --accent: var(--cyan);
    --cut: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
    filter: drop-shadow(0 0 10px color-mix(in srgb, var(--accent) 40%, transparent));
    transition: filter 0.4s;
  }
  .shell.warn { --accent: var(--amber); }
  .shell.bad  { --accent: var(--red); }
  .shell.idle { --accent: var(--dim); }
  .shell:hover {
    filter: drop-shadow(0 0 18px color-mix(in srgb, var(--accent) 65%, transparent));
  }

  /* The outer layer shows through as a 1px border that follows the cut corners */
  .card {
    position: relative;
    isolation: isolate;
    padding: 1.25rem 1.25rem 1rem;
    clip-path: var(--cut);
    background: color-mix(in srgb, var(--accent) 75%, transparent);
    transition: background 0.4s;
  }
  .card::before {
    content: '';
    position: absolute;
    inset: 1px;
    z-index: -1;
    clip-path: var(--cut);
    background:
      linear-gradient(160deg, color-mix(in srgb, var(--accent) 10%, transparent), transparent 60%),
      var(--panel);
    backdrop-filter: blur(10px);
  }
  .shell.bad {
    animation: flicker 1.6s steps(1) infinite;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .label {
    position: relative;
    margin: 0;
    font-family: var(--font-pixel);
    font-size: 0.65rem;
    font-weight: 400;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--accent);
    text-shadow: 0 0 6px var(--accent);
  }

  .badge {
    padding: 0.3rem 0.45rem;
    font-family: var(--font-pixel);
    font-size: 0.45rem;
    text-transform: uppercase;
    color: var(--accent);
    border: 1px solid color-mix(in srgb, var(--accent) 60%, transparent);
    white-space: nowrap;
  }

  .value {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    margin: 1.1rem 0 0.9rem;
  }
  .num {
    font-size: clamp(2rem, 6vw, 2.6rem);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--text);
    text-shadow: 0 0 12px color-mix(in srgb, var(--accent) 70%, transparent);
  }
  .unit {
    font-size: 0.85rem;
    color: var(--dim);
  }

  /* RGB-split glitch, only while a value is changing */
  .label::before,
  .label::after {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    opacity: 0;
  }
  .glitching .label::before {
    opacity: 1;
    color: var(--magenta);
    animation: glitch 0.3s steps(2) 2;
  }
  .glitching .label::after {
    opacity: 1;
    color: var(--cyan);
    animation: glitch 0.3s steps(2) 2 reverse;
  }

  @keyframes glitch {
    0%   { clip-path: inset(0 0 60% 0);  transform: translate(-2px, 0); }
    25%  { clip-path: inset(40% 0 20% 0); transform: translate(2px, 0); }
    50%  { clip-path: inset(70% 0 0 0);  transform: translate(-1px, 0); }
    75%  { clip-path: inset(10% 0 70% 0); transform: translate(1px, 0); }
    100% { clip-path: inset(0 0 100% 0); transform: none; }
  }

  @keyframes flicker {
    0%, 100% { filter: drop-shadow(0 0 10px color-mix(in srgb, var(--red) 45%, transparent)); }
    92%      { filter: drop-shadow(0 0 2px color-mix(in srgb, var(--red) 20%, transparent)) brightness(0.75); }
    95%      { filter: drop-shadow(0 0 14px color-mix(in srgb, var(--red) 60%, transparent)); }
  }
</style>
