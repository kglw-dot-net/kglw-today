<script setup lang="ts">
import { useHead } from '@unhead/vue'
import FooterBar from '@/components/FooterBar.vue'

useHead({ title: 'Page Not Found — King Gizzard History' })
</script>

<template>
  <main class="not-found">
    <h1>Page not found</h1>
    <p><RouterLink to="/">Back to Calendar</RouterLink></p>
  </main>
  <FooterBar />
</template>

<style scoped>
.not-found {
  max-width: 33em;
  margin: 4em auto;
  text-align: center;
}
</style>
