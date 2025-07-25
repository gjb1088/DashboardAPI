<script lang="ts">
  import { onDestroy } from 'svelte';
  import { slide } from 'svelte/transition';
  import type { Telemetry } from './lib/types/telemetry';
  import { getTelemetry }  from './lib/api/getTelemetry';

  let telemetry: Telemetry | null = null;
  let showing = false;
  let hideTimer: ReturnType<typeof setTimeout>;

  async function fetchTelemetry() {
    try {
      telemetry = await getTelemetry();
      showing   = true;
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        showing   = false;
        telemetry = null;
      }, 15_000);
    } catch (err) {
      console.error(err);
    }
  }

  onDestroy(() => clearTimeout(hideTimer));
</script>

<style>
  /* 1) Neon 8-bit font + page background */
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  :global(body) {
    margin: 0;
    font-family: 'Press Start 2P', monospace;
    background: linear-gradient(135deg, #110022 0%, #001144 50%, #220022 100%);
    color: #fff;
    display: flex;
    justify-content: center;
    padding: 2rem;
  }

  /* 2) Button style */
  button {
    padding: 0.75rem 1.5rem;
    font-family: inherit;
    font-size: 1rem;
    background: linear-gradient(45deg, #ff00ff, #00ffff);
    color: #000;
    border: none;
    border-radius: 9999px;
    box-shadow: 0 0 10px rgba(255, 0, 255, 0.7);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.9);
  }

  /* 3) Card container */
  .cards {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    width: 100%;
    max-width: 800px;
  }

  /* 4) Neon-glass cards */
  .card {
    flex: 1;
    padding: 1.5rem;
    background: rgba(0, 0, 0, 0.4);
    border: 2px solid #ff00ff;
    border-radius: 1rem;
    text-align: center;
    box-shadow: 0 0 15px rgba(255, 0, 255, 0.5);
    backdrop-filter: blur(8px);
    transition: box-shadow 0.3s;
  }
  .card:hover {
    box-shadow: 0 0 25px rgba(0, 255, 255, 0.7);
  }

  .card h4 {
    margin: 0;
    font-size: 1rem;
    color: #00ffff;
    text-shadow: 0 0 5px #00ffff;
  }
  .card p {
    margin: 0.5rem 0 0;
    font-size: 1.5rem;
    color: #fff;
    text-shadow: 0 0 5px #fff;
  }
/* 1. Always allow horizontal scrolling if cards overflow */
.cards {
  overflow-x: auto;
  padding-bottom: 0.5rem;  /* space for scrollbar */
}

/* 2. Give each card a minimum width so they stay readable */
.card {
  min-width: 12rem;
}

/* 3. On very small screens, stack them vertically */
@media (max-width: 480px) {
  .cards {
    flex-direction: column;
    overflow-x: visible;
  }
  .card {
    min-width: auto;  /* allow full width */
    width: 100%;
  }
 /* 1) Glitch animation */
  @keyframes glitch {
    0% {
      clip: rect(10px, 9999px, 40px, 0);
      transform: skew(0.5deg);
    }
    10% {
      clip: rect(80px, 9999px, 110px, 0);
      transform: skew(0.5deg);
    }
    20% {
      clip: rect(50px, 9999px, 80px, 0);
      transform: skew(0.5deg);
    }
    30% {
      clip: rect(20px, 9999px, 50px, 0);
      transform: skew(0.5deg);
    }
    40% {
      clip: rect(70px, 9999px, 100px, 0);
      transform: skew(0.5deg);
    }
    50% {
      clip: rect(40px, 9999px, 70px, 0);
      transform: skew(0.5deg);
    }
    60% {
      clip: rect(10px, 9999px, 40px, 0);
      transform: skew(0.5deg);
    }
    70% {
      clip: rect(80px, 9999px, 110px, 0);
      transform: skew(0.5deg);
    }
    80% {
      clip: rect(50px, 9999px, 80px, 0);
      transform: skew(0.5deg);
    }
    90% {
      clip: rect(20px, 9999px, 50px, 0);
      transform: skew(0.5deg);
    }
    100% {
      clip: rect(70px, 9999px, 100px, 0);
      transform: skew(0.5deg);
    }
  }

  /* 2) Glitch wrapper */
  .glitch {
    position: relative;
    display: inline-block;
    color: #00ffff;
    font-size: 1rem;
    text-shadow: 0 0 5px #00ffff;
    animation: glitch 2s infinite linear;
  }

  /* 3) Pseudo-layer for color offset */
  .glitch::before,
  .glitch::after {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }

  .glitch::before {
    left: 2px;
    text-shadow: -2px 0 red;
    animation: glitch 2s infinite linear reverse;
  }

  .glitch::after {
    left: -2px;
    text-shadow: -2px 0 blue;
    animation: glitch 2s infinite linear;
  }
}
</style>

{#if !showing}
  <button on:click={fetchTelemetry}>
    Fetch Telemetry
  </button>
{/if}

{#if showing && telemetry}
  <div class="cards" in:slide={{ y: 20, duration: 400 }}>
    <div class="card">
      <h4 class="glitch" data-text="Latency">Latency</h4>
      <p>{Number(telemetry.latency).toFixed(2)} ms</p>
    </div>
    <div class="card">
      <h4 class="glitch" data-text="Packet Loss">Packet Loss</h4>
      <p>{Number(telemetry.packet_loss).toFixed(1)} %</p>
    </div>
    <div class="card">
      <h4 class="glitch" data-text="Throughput">Throughput</h4>
      <p>{Number(telemetry.throughput).toFixed(2)} Mbps</p>
    </div>
  </div>
{/if}
