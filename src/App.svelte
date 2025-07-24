+<script>
+  // plain JS—no TS, no type errors
+  let metrics = null;
+
+  async function fetchData() {
+    const res = await fetch(
+      import.meta.env.VITE_TELEMETRY_API_URL + '/api/v1/telemetry/network',
+      { headers: { 'X-API-Key': '0000' } }
+    );
+    metrics = await res.json();
+  }
+</script>
