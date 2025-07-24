<script lang="ts">
  import { onMount } from 'svelte';
  import type { Telemetry } from './types/telemetry';
  import { getTelemetry }     from './types/telemetry';

  let data: Telemetry | null = null;
  let error: string | null   = null;

  onMount(async () => {
    try {
      data = await getTelemetry();
    } catch (e) {
      error = (e as Error).message;
    }
  });
</script>

{#if error}
  <p class="error">Error: {error}</p>
{:else if !data}
  <p>Loading…</p>
{:else}
  <p>Latency: {data.latency}</p>
  <!-- etc… -->
{/if}
