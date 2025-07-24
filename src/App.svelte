<script lang="ts">
  import { onMount } from 'svelte';
  import type { Telemetry } from './lib/types/telemetry';
  import { getTelemetry }    from './lib/api/getTelemetry';

  let data: Telemetry | null = null;
  let error: string | null   = null;

  const URL = import.meta.env.VITE_TELEMETRY_API_URL;
  const KEY = import.meta.env.VITE_TELEMETRY_API_KEY;

  async function fetchData() {
    data  = null;
    error = null;
    try {
      data = await getTelemetry(URL, KEY);
    } catch (e: any) {
      error = e.message;
    }
  }

  onMount(fetchData);
</script>

<main>
  <h1>Network Telemetry</h1>

  {#if error}
    <p style="color:red">Error: {error}</p>
  {:else if !data}
    <button on:click={fetchData}>Fetch Telemetry</button>
  {:else}
    <div style="display:flex; gap:1rem">
      <div><strong>Latency:</strong> {data.latency}</div>
      <div><strong>Packet Loss:</strong> {data.packet_loss}</div>
      <div><strong>Throughput:</strong> {data.throughput}</div>
    </div>
  {/if}
</main>
