<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { dateToSlug } from '@/utils/date'
import MonthDayPage from '@/pages/MonthDayPage.vue'

// todaySlug is null until the component mounts on the client, at which point
// the visitor's local date is known and MonthDayPage is rendered.
const todaySlug = ref<string | null>(null)
onMounted(() => {
  todaySlug.value = dateToSlug(new Date())
})
</script>

<template>
  <noscript>This requires JavaScript to determine what day it is for you.</noscript>
  <MonthDayPage v-if="todaySlug" :monthday="todaySlug" />
</template>
