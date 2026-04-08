<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { dateToSlug } from '@/utils/date'

const todayDate = ref<Date | null>(null)
onMounted(() => {
  todayDate.value = new Date()
})

// The iframe points to today's month-day page with sparse UI mode enabled.
// This is computed client-side so it always reflects the visitor's current day.
const iframeSrc = computed(() => {
  if (!todayDate.value) return undefined
  return `/${dateToSlug(todayDate.value)}?ui=sparse`
})
</script>

<template>
  <head>
    <title>Right Now in King Gizzard History</title>
  </head>

  <noscript>This requires JavaScript to determine what day it is for you.</noscript>

  <iframe
    v-if="iframeSrc"
    :src="iframeSrc"
    title="Right Now in King Gizzard History"
    class="now-iframe"
  />
</template>

<style>
/* Remove body margin so the iframe fills the full viewport */
body {
  margin: 0 !important;
}
</style>

<style scoped>
.now-iframe {
  width: 100vw;
  height: 100vh;
  border: 0;
}
</style>
