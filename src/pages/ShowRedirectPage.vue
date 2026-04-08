<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { showsByDate } from '@/utils/data'

const route = useRoute()

// Parse "2024-03-15" or "2024-03-15@2" from the route param
const parsedShowdate = computed(() => {
  const raw = route.params.showdate as string
  const atIndex = raw.indexOf('@')
  if (atIndex === -1) {
    return { dateStr: raw, showOrder: undefined }
  }
  return {
    dateStr: raw.slice(0, atIndex),
    showOrder: parseInt(raw.slice(atIndex + 1), 10),
  }
})

const matchingShow = computed(() => {
  const { dateStr, showOrder } = parsedShowdate.value
  const candidates = showsByDate(dateStr, showOrder)
  // When no showOrder is specified, default to the first show of the day
  if (candidates.length === 0 && showOrder === undefined) {
    return showsByDate(dateStr)[0] ?? null
  }
  return candidates[0] ?? null
})

const redirectUrl = computed(() => {
  const show = matchingShow.value
  if (!show) return null
  const campaign = route.params.showdate as string
  return `https://kglw.net/setlists/${show.permalink}?src=kglw.today&campaign=${campaign}`
})

// Redirect on mount (client-side only — the prerendered HTML still shows a
// fallback link in case JavaScript is disabled or the redirect is slow).
onMounted(() => {
  if (redirectUrl.value) {
    window.location.replace(redirectUrl.value)
  }
})
</script>

<template>
  <head>
    <title>Redirecting…</title>
    <!-- Meta-refresh as a no-JS fallback -->
    <meta v-if="redirectUrl" http-equiv="refresh" :content="`0; URL=${redirectUrl}`" />
  </head>

  <main>
    <p v-if="redirectUrl">
      Redirecting to <a :href="redirectUrl">{{ redirectUrl }}</a>
    </p>
    <p v-else>
      No show found for <strong>{{ route.params.showdate }}</strong>.
      <RouterLink to="/">Back to Calendar</RouterLink>
    </p>
  </main>
</template>
