<script lang="ts">
  import { onMount } from 'svelte';
  import type { Telemetry } from './types/telemetry';
  import { getTelemetry }    from './types/telemetry';

  let data: Telemetry | null = null;
  let error: string | null   = null;

  async function fetchData() {
    try {
      data  = await getTelemetry();
      error = null;
    } catch (err: any) {
      error = err.message;
      data  = null;
    }
  }

  onMount(fetchData);
</script>

<button on:click={fetchData}>Fetch Telemetry</button>

{#if data}
  <div class="cards">
    <div class="card">Latency: {data.latency}</div>
    <div class="card">Packet Loss: {data.packet_loss}</div>
    <div class="card">Throughput: {data.throughput}</div>
  </div>
{:else if error}
  <p class="error">Error: {error}</p>
{:else}
  <p>Loading…</p>
{/if}

<style>
  .cards { display: flex; gap: 1rem; }
  .card  { padding: 1rem; border: 1px solid #ccc; border-radius: 4px; }
  .error { color: red; }
</style>
