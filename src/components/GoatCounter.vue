<script setup lang="ts">
// GoatCounter analytics is injected by appending <script> tags to <head>
// at runtime, matching how the original Gatsby component worked.
// It only runs in production and never on localhost (to keep analytics clean).
import { onMounted } from 'vue'

onMounted(() => {
  const isProduction = import.meta.env.PROD
  const isNotLocalhost = !window.location.host.startsWith('localhost')
  if (!isProduction || !isNotLocalhost) return

  // Configure the custom path prefix so this site's visits are identifiable
  // in the GoatCounter dashboard as "/@today/…" rather than plain paths.
  const configScript = document.createElement('script')
  configScript.textContent = `
    window.goatcounter = {
      path: function() {
        return '/@today' + location.pathname + location.search + location.hash;
      }
    };
  `
  document.head.appendChild(configScript)

  const counterScript = document.createElement('script')
  counterScript.setAttribute('data-goatcounter', 'https://kglw.goatcounter.com/count')
  counterScript.async = true
  counterScript.src = '//gc.zgo.at/count.js'
  document.head.appendChild(counterScript)
})
</script>

<!-- eslint-disable vue/valid-template-root -->
<template>
  <!-- GoatCounter injects its scripts into <head> on mount; no DOM output here -->
</template>
