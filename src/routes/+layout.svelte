<script>
  export let data;
</script>

<slot />

<style global>
  body {
    margin: 0;
    font-family: 'Press Start 2P', monospace;
    background: linear-gradient(
      135deg,
      #110022 0%,
      #001144 50%,
      #220022 100%
    );
    color: #fff;
  }
  /* remove default button styles everywhere */
  button {
    font-family: inherit;
  }
</style>
