<script>
  let metrics = null;

  async function fetchData() {
    console.log('🔘 button clicked');
    // 1) Check the env var
    const base = import.meta.env.VITE_TELEMETRY_API_URL;
    console.log('API base URL:', base);

    if (!base) {
      console.error('🚨 VITE_TELEMETRY_API_URL is undefined!');
      return;
    }

    const url = base + '/api/v1/telemetry/network';
    console.log('Fetching URL:', url);

    try {
      const res = await fetch(url, {
        headers: { 'X-API-Key': '0000' }
      });
      console.log('Fetch response status:', res.status);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      console.log('Received data:', data);
      metrics = data;
    } catch (err) {
      console.error('Fetch failed:', err);
    }
  }
</script>

<main>
  <h1>Network Telemetry</h1>
  <button on:click={fetchData}>Fetch Telemetry</button>

  {#if metrics}
    <!-- your cards markup here -->
  {/if}
</main>
