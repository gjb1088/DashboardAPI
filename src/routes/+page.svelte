<script lang="ts">
  import { onMount } from 'svelte';
  import type { Telemetry } from '$lib/types/telemetry';
  import { getTelemetry } from '$lib/api/getTelemetry';

  let data: Telemetry | null = null;
  let error = '';

  onMount(async () => {
    try {
      data = await getTelemetry();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unknown error';
    }
  });
</script>

<main>
  <h1>Network Telemetry</h1>
  {#if error}
    <p class="error">Error: {error}</p>
  {:else if !data}
    <p>Loading…</p>
  {:else}
    <div class="grid">
      <div><strong>Latency:</strong> {data.latency}</div>
      <div><strong>Packet Loss:</strong> {data.packet_loss}</div>
      <div><strong>Throughput:</strong> {data.throughput}</div>
    </div>
  {/if}
</main>

<style>
  .grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  }
  .error { color: #c00; }
</style>
