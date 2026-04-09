<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { dateToSlug } from '@/utils/date'
import FooterBar from '@/components/FooterBar.vue'

useHead({ title: 'Today in King Gizzard History' })

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
  <noscript>This requires JavaScript to determine what day it is for you.</noscript>

  <iframe
    v-if="iframeSrc"
    :src="iframeSrc"
    title="Today in King Gizzard History"
    class="home-iframe"
  />
  <FooterBar />
</template>

<style>
/* Remove body margin so the iframe fills the full viewport */
body {
  margin: 0 !important;
}
</style>

<style scoped>
.home-iframe {
  width: 100vw;
  height: 100vh;
  border: 0;
}
</style>
