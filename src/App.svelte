<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { Telemetry } from './lib/types/telemetry';
  import { getTelemetry }  from './lib/api/getTelemetry';

  // holds the latest telemetry, or null if none/faded out
  let telemetry: Telemetry | null = null;

  // track whether we're showing the cards
  let showing = false;

  // timer handle so we can clean up if component unmounts early
  let hideTimer: ReturnType<typeof setTimeout>;

  // call the API and show cards
  async function fetchTelemetry() {
    try {
      telemetry = await getTelemetry();
      showing   = true;

      // after 30s, hide the cards
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        showing   = false;
        telemetry = null;
      }, 30_000);
    } catch (err) {
      console.error(err);
      // optionally show an error card/message here
    }
  }

  // clear timer if component is torn down
  onDestroy(() => clearTimeout(hideTimer));
</script>

<style>
  .cards {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
  .card {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: .5rem;
    flex: 1;
    text-align: center;
  }
  button {
    padding: .5rem 1rem;
    font-size: 1rem;
  }
</style>

{#if !showing}
  <button on:click={fetchTelemetry}>
    Fetch Telemetry
  </button>
{/if}

{#if showing && telemetry}
  <div class="cards">
    <div class="card">
      <h4>Latency</h4>
      <p>{telemetry.latency}</p>
    </div>
    <div class="card">
      <h4>Packet Loss</h4>
      <p>{telemetry.packet_loss}</p>
    </div>
    <div class="card">
      <h4>Throughput</h4>
      <p>{telemetry.throughput}</p>
    </div>
  </div>
{/if}
