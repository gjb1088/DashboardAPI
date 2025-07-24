<script>
  let metrics = null;
  async function fetchData() { /* … */ }
</script>

<main>
  <h1>Network Telemetry</h1>
  <button on:click={fetchData}>Fetch Telemetry</button>

  {#if metrics}
    <pre>{JSON.stringify(metrics, null, 2)}</pre>
  {/if}
</main>

<style>
  body, main { font-family: sans-serif; }
  h1 { color: #0ff; }
</style>
