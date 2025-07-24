<!-- dashboard/src/App.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import type { Telemetry } from './types/telemetry';
  import { getTelemetry }      from './types/telemetry';

  let data: Telemetry | null = null;
  let error = '';

  async function fetchData() {
    error = '';
    try {
      data = await getTelemetry();
    } catch (err: any) {
      error = err.message;
    }
  }

  // optional: fetch on mount
  // onMount(fetchData);
</script>

<main>
  <button on:click={fetchData}>Fetch Telemetry</button>

  {#if error}
    <p class="error">Error: {error}</p>
  {/if}

  {#if data}
    <div class="cards">
      <div class="card">
        <h3>Latency</h3>
        <p>{data.latency}</p>
      </div>
      <div class="card">
        <h3>Packet Loss</h3>
        <p>{data.packet_loss}</p>
      </div>
      <div class="card">
        <h3>Throughput</h3>
        <p>{data.throughput}</p>
      </div>
    </div>
  {/if}
</main>

<style>
  main { display: flex; flex-direction: column; align-items: center; padding: 2rem; }
  .cards { display: flex; gap: 1rem; margin-top: 1rem; }
  .card { padding: 1rem; border: 1px solid #ccc; border-radius: 4px; width: 150px; text-align: center; }
  .error { color: red; margin-top: 1rem; }
  button { padding: 0.5rem 1rem; font-size: 1rem; }
</style>
