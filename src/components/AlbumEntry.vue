<script setup lang="ts">
export interface AlbumEntry {
  // Fractional year used for chronological sort
  sortKey: number
  entryType: 'release'
  id: string
  year: number
  name: string
  releaseType: string | undefined
  note: string | undefined
  url: string | undefined
}

defineProps<{
  entry: AlbumEntry
  dayLabelShort: string
}>()
</script>

<template>
  <li class="release layout-monthday--entry">
    {{ entry.year }} {{ dayLabelShort }}:
    <wbr />
    <a
      v-if="entry.url"
      :href="entry.url"
      target="_blank"
      rel="noreferrer"
    >
      <cite>{{ entry.name }}</cite>{{ entry.releaseType ? ` ${entry.releaseType}` : '' }}
    </a>
    <template v-else>
      <cite>{{ entry.name }}</cite>{{ entry.releaseType ? ` ${entry.releaseType}` : '' }}
    </template>
    released
    <span
      v-if="entry.note"
      class="layout-monthday--entry--note"
      :title="entry.note"
    >📝</span>
  </li>
</template>
