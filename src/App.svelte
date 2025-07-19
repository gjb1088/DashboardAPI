<script>
  import { fetchNetworkTelemetry } from './telemetry';
  let data = null;
  let error = null;

  // your button handler…
  async function handleFetch() {
    error = null;
    try {
      data = await fetchNetworkTelemetry();
      setTimeout(() => (data = null), 10000);
    } catch (e) {
      error = e?.message || 'Unknown error';
    }
  }

  // card styling constant
  const cardStyle = `
    border:1px solid #ccc;
    border-radius:8px;
    padding:1rem;
    box-shadow:2px 2px 5px rgba(0,0,0,0.1);
    width:150px;
    text-align:center;
  `;
</script>

<main style="padding:2rem; font-family:sans-serif;">
  {#if !data}
    <button on:click={handleFetch} style="padding:0.5rem 1rem; font-size:1rem;">
      Fetch Telemetry
    </button>
    {#if error}
      <p style="color:red;">Error: {error}</p>
    {/if}
  {:else}
    <div style="display:flex; gap:1rem; margin-top:1rem;">
      <div style={cardStyle}>
        <h4>Latency</h4>
        <p>{data.latency_ms.toFixed(2)} ms</p>
      </div>
      <div style={cardStyle}>
        <h4>Packet Loss</h4>
        <p>{data.packet_loss_pct.toFixed(1)} %</p>
      </div>
      <div style={cardStyle}>
        <h4>Throughput</h4>
        <p>{data.throughput_mbps.toFixed(2)} Mbps</p>
      </div>
    </div>
  {/if}
</main>
