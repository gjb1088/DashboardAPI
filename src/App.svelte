<script lang="ts">
  import { onMount } from 'svelte';
  import type { Telemetry } from './lib/types/telemetry';
  import { getTelemetry } from './lib/api/getTelemetry';

  let data: Telemetry | null = null;
  let error = '';

  const API_URL = import.meta.env.VITE_TELEMETRY_API_URL as string;
  const API_KEY = import.meta.env.VITE_TELEMETRY_API_KEY as string;

  async function fetchIt() {
    error = '';
    try {
      data = await getTelemetry(API_URL, API_KEY);
    } catch (e: any) {
      error = e.message;
      data = null;
    }
  }

  onMount(fetchIt);
</script>

<main>
  <button on:click={fetchIt}>Fetch Telemetry</button>

  {#if error}
    <p style="color: red">Error: {error}</p>
  {:else if data}
    <div>Latency: {data.latency}</div>
    <div>Packet Loss: {data.packetLoss}</div>
    <div>Throughput: {data.throughput}</div>
  {:else}
    <p>Loading…</p>
  {/if}
</main>
