<script setup lang="ts">
import MarkdownIt from 'markdown-it'

export interface MiscEntry {
  // Fractional year used for chronological sort
  sortKey: number
  entryType: 'misc'
  id: string
  year: number
  // Raw markdown text from the data source; rendered to inline HTML by this component
  markdownContent: string
}

defineProps<{
  entry: MiscEntry
  dayLabelShort: string
}>()

const md = new MarkdownIt()
</script>

<template>
  <li class="misc layout-monthday--entry">
    {{ entry.year }} {{ dayLabelShort }}:
    <wbr />
    <!-- eslint-disable-next-line vue/no-v-html -->
    <span v-html="md.renderInline(entry.markdownContent)" />
  </li>
</template>
