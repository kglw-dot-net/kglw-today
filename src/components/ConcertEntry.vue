<script setup lang="ts">
export interface ConcertEntry {
  // Fractional year used for chronological sort: year.showorder (e.g. 2019.2 for second show)
  sortKey: number
  entryType: 'concert-kglw' | 'concert-other'
  id: string
  artist: string
  showYear: number
  showOrder: number
  permalink: string
  venuename: string
  city: string
  country: string
  notes: string | null
}

const props = defineProps<{
  entry: ConcertEntry
  dayLabelShort: string
  month: number
  day: number
}>()

function setlistUrl(permalink: string, month: number, day: number): string {
  const monthPadded = String(month).padStart(2, '0')
  const dayPadded = String(day).padStart(2, '0')
  return `https://kglw.net/setlists/${permalink}?src=kglw.today&campaign=${monthPadded}-${dayPadded}`
}
</script>

<template>
  <li
    :class="[
      'layout--entry-concert',
      `layout--entry-concert-${entry.entryType === 'concert-kglw' ? 'kglw' : 'other'}`,
      'layout-monthday--entry',
    ]"
  >
    <span class="layout--entry--artist">{{ entry.artist }}</span>
    <a
      :href="setlistUrl(entry.permalink, props.month, props.day)"
      target="_blank"
      rel="noreferrer"
    >
      {{ entry.showYear }} {{ dayLabelShort }} @
      {{ entry.venuename
      }}{{ entry.showOrder === 1
        ? `, ${entry.city}, ${entry.country}`
        : ` [show ${entry.showOrder}]` }}
    </a>
    <span
      v-if="entry.notes"
      class="layout-monthday--entry--note"
      :title="entry.notes ?? undefined"
    >📝</span>
  </li>
</template>
