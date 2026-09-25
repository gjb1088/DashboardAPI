<script lang="ts">
  export let values: number[] = [];

  const W = 120;
  const H = 32;
  const PAD = 3;

  $: min = Math.min(...values);
  $: max = Math.max(...values);
  $: points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * W;
      const y = max === min ? H / 2 : H - PAD - ((v - min) / (max - min)) * (H - PAD * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
</script>

{#if values.length > 1}
  <svg viewBox="0 0 {W} {H}" preserveAspectRatio="none" aria-hidden="true">
    <polyline points="{points} {W},{H} 0,{H}" class="fill" />
    <polyline {points} class="line" />
  </svg>
{:else}
  <div class="empty" aria-hidden="true">awaiting history…</div>
{/if}

<style>
  svg,
  .empty {
    display: block;
    width: 100%;
    height: 2rem;
  }
  .line {
    fill: none;
    stroke: var(--accent);
    stroke-width: 1.5;
    vector-effect: non-scaling-stroke;
    filter: drop-shadow(0 0 3px var(--accent));
  }
  .fill {
    fill: color-mix(in srgb, var(--accent) 12%, transparent);
    stroke: none;
  }
  .empty {
    font-size: 0.7rem;
    line-height: 2rem;
    color: var(--dim);
  }
</style>
