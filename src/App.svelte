<script lang="ts">
  let metrics: {
    latency: number;
    packet_loss: number;
    throughput: number;
  } | null = null;

  async function fetchData() {
    const res = await fetch(
      import.meta.env.VITE_TELEMETRY_API_URL + '/api/v1/telemetry/network',
      { headers: { 'X-API-Key': '0000' } }
    );
    metrics = await res.json();
  }
</script>

<div class="dashboard">
  <button class="neon-btn" on:click={fetchData}>
    Fetch Telemetry
  </button>

  {#if metrics}
    <div class="metrics-grid">
      <div class="card">
        <h2>Latency</h2>
        <p>{metrics.latency.toFixed(2)} ms</p>
      </div>
      <div class="card">
        <h2>Packet Loss</h2>
        <p>{metrics.packet_loss.toFixed(1)} %</p>
      </div>
      <div class="card">
        <h2>Throughput</h2>
        <p>{metrics.throughput.toFixed(2)} Mbps</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .dashboard {
    min-height: 100vh;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .neon-btn {
    background: linear-gradient(45deg, #ff00ff, #00ffff);
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 9999px;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
    color: #000;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    letter-spacing: 1px;
  }
  .neon-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.9);
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    gap: 1.5rem;
    width: 100%;
    max-width: 800px;
    margin-top: 2rem;
  }

  .card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid #ff00ff;
    border-radius: 1rem;
    padding: 1.5rem;
    text-align: center;
    box-shadow: 0 0 15px rgba(255, 0, 255, 0.5);
    backdrop-filter: blur(8px);
    transition: box-shadow 0.3s;
  }
  .card:hover {
    box-shadow: 0 0 25px rgba(0, 255, 255, 0.7);
  }

  .card h2 {
    font-size: 1rem;
    margin-bottom: 0.75rem;
    color: #00ffff;
    text-shadow: 0 0 5px #00ffff;
  }

  .card p {
    font-size: 1.75rem;
    margin: 0;
    color: #fff;
    text-shadow: 0 0 5px #fff;
  }
</style>
