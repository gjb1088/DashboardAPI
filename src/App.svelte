<script lang="ts">
  import { onMount } from 'svelte';
  import { getTelemetry } from './lib/api/getTelemetry';
  import type { Telemetry } from './lib/types/telemetry';

  let data: Telemetry|null = null;
  let error: string|null = null;

  const URL = import.meta.env.VITE_TELEMETRY_API_URL;
  const KEY = import.meta.env.VITE_TELEMETRY_API_KEY;

  async function fetchData() {
    try {
      data = await getTelemetry(URL, KEY);
    } catch (e) {
      error = e.message;
    }
  }

  onMount(fetchData);
</script>

<main>
  {#if error}
    <p style="color:red">Error: {error}</p>
  {:else if data}
    <div style="display:flex;gap:1rem">
      <div>Latency: {data.latency}</div>
      <div>Packet Loss: {data.packet_loss}</div>
      <div>Throughput: {data.throughput}</div>
    </div>
  {:else}
    <button on:click={fetchData}>Fetch Telemetry</button>
  {/if}
</main>
