<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import FooterBar from '@/components/FooterBar.vue'
import ConcertEntry from '@/components/ConcertEntry.vue'
import type { ConcertEntry as ConcertEntryType } from '@/components/ConcertEntry.vue'
import AlbumEntry from '@/components/AlbumEntry.vue'
import type { AlbumEntry as AlbumEntryType } from '@/components/AlbumEntry.vue'
import MiscEntry from '@/components/MiscEntry.vue'
import type { MiscEntry as MiscEntryType } from '@/components/MiscEntry.vue'
import { dateToText, slugToMonthDay, adjacentSlugs } from '@/utils/date'
import {
  showsForDay,
  albumsForDay,
  birthdaysForDay,
  miscForDay,
  showNotesForDay,
} from '@/utils/data'

const route = useRoute()

// Optional prop: when rendered directly (e.g. from HomePage), the caller
// supplies the slug so the route param isn't needed.
const props = defineProps<{ monthday?: string }>()

// Detect ?ui=sparse after mount (client-side only — not available during SSR)
const isSparseLayout = ref(false)
onMounted(() => {
  isSparseLayout.value = window.location.search === '?ui=sparse'
})

const activeSlug = computed(() =>
  props.monthday ?? (route.params.monthday as string),
)

const monthDay = computed(() => slugToMonthDay(activeSlug.value))

// Year-2000 Date object representing this calendar day (leap year so Feb 29 exists)
const dateObject = computed(() => {
  const parsed = monthDay.value
  if (!parsed) return null
  return new Date(2000, parsed.month - 1, parsed.day)
})

const dayLabelShort = computed(() =>
  dateObject.value ? dateToText(dateObject.value) : '',
)
const dayLabelLong = computed(() =>
  dateObject.value ? dateToText(dateObject.value, { month: 'long' }) : '',
)

// Page <title>
const pageTitle = computed(() => `${dayLabelLong.value} in King Gizzard History`)
useHead({ title: pageTitle })

const prevSlug = computed(() => adjacentSlugs(activeSlug.value).prev)
const nextSlug = computed(() => adjacentSlugs(activeSlug.value).next)

// Human-readable labels for the nav arrows
const prevLabel = computed(() => {
  const parsed = slugToMonthDay(prevSlug.value)
  if (!parsed) return prevSlug.value
  return dateToText(new Date(2000, parsed.month - 1, parsed.day))
})
const nextLabel = computed(() => {
  const parsed = slugToMonthDay(nextSlug.value)
  if (!parsed) return nextSlug.value
  return dateToText(new Date(2000, parsed.month - 1, parsed.day))
})

// --- Data for this calendar day ---
const dayShows = computed(() => {
  const parsed = monthDay.value
  if (!parsed) return []
  return showsForDay(parsed.month, parsed.day)
})

const dayAlbums = computed(() => {
  const parsed = monthDay.value
  if (!parsed) return []
  return albumsForDay(parsed.month, parsed.day)
})

const dayBirthdays = computed(() => {
  const parsed = monthDay.value
  if (!parsed) return []
  return birthdaysForDay(parsed.month, parsed.day)
})

const dayMisc = computed(() => {
  const parsed = monthDay.value
  if (!parsed) return []
  return miscForDay(parsed.month, parsed.day)
})

const dayShowNotes = computed(() => {
  const parsed = monthDay.value
  if (!parsed) return []
  return showNotesForDay(parsed.month, parsed.day)
})

// Build a year→notes map so each concert row can reference its annotation
const showNotesByYear = computed(() => {
  const map: Record<number, string[]> = {}
  for (const noteEntry of dayShowNotes.value) {
    if (!map[noteEntry.year]) map[noteEntry.year] = []
    // Non-null assertion safe: we just guaranteed the array exists above.
    // https://www.typescriptlang.org/tsconfig#noUncheckedIndexedAccess
    map[noteEntry.year]!.push(noteEntry.note)
  }
  return map
})

type AnyEntry = ConcertEntryType | AlbumEntryType | MiscEntryType

const sortedEntries = computed((): AnyEntry[] => {
  const parsed = monthDay.value
  if (!parsed) return []

  const concertEntries: ConcertEntryType[] = dayShows.value.map((show) => {
    const notes = showNotesByYear.value[show.show_year]?.join('; ') ?? null
    return {
      sortKey: Number(`${show.show_year}.${show.showorder}`),
      entryType: show.artist.startsWith('King Gizzard') ? 'concert-kglw' : 'concert-other',
      id: `${show.show_year}-concert-${show.show_id}`,
      artist: show.artist,
      showYear: show.show_year,
      showOrder: show.showorder,
      permalink: show.permalink,
      venuename: show.venuename ?? '',
      city: show.city ?? '',
      country: show.country ?? '',
      notes,
    }
  })

  const albumEntries: AlbumEntryType[] = dayAlbums.value.map((album) => ({
    sortKey: album.year,
    entryType: 'release',
    id: `${album.year}-release-${album.type}-${album.name}`,
    year: album.year,
    name: album.name,
    releaseType: album.type,
    note: album.note,
    url: album.url,
  }))

  const miscEntries: MiscEntryType[] = dayMisc.value.map((event, index) => ({
    sortKey: event.year,
    entryType: 'misc',
    // Use index as tie-breaker since SHA is async — content is unique enough with year prefix
    id: `${event.year}-misc-${index}`,
    year: event.year,
    markdownContent: event.what,
  }))

  return [...concertEntries, ...albumEntries, ...miscEntries].sort(
    (entryA, entryB) => entryA.sortKey - entryB.sortKey,
  )
})
</script>

<template>
  <article :class="['layout-monthday', { 'layout-monthday-sparse': isSparseLayout }]">
    <nav>
      <RouterLink :to="`/${prevSlug}`" class="nav-prev">{{ prevLabel }}</RouterLink>
      <RouterLink :to="`/${nextSlug}`" class="nav-next">{{ nextLabel }}</RouterLink>
    </nav>

    <main>
      <h1>{{ dayLabelLong }} <br />in <br /><a href="https://kglw.today" target="_blank" rel="noreferrer">King Gizzard <br />History</a></h1>

      <em
        v-for="birthday in dayBirthdays"
        :key="`${birthday.year}-${birthday.who}`"
        class="layout-monthday--birthday"
      >
        Happy Birthday to {{ birthday.who }}!!
      </em>

      <ul v-if="sortedEntries.length">
        <template v-for="entry in sortedEntries" :key="entry.id">
          <ConcertEntry
            v-if="entry.entryType === 'concert-kglw' || entry.entryType === 'concert-other'"
            :entry="(entry as ConcertEntryType)"
            :day-label-short="dayLabelShort"
            :month="monthDay!.month"
            :day="monthDay!.day"
          />
          <AlbumEntry
            v-else-if="entry.entryType === 'release'"
            :entry="(entry as AlbumEntryType)"
            :day-label-short="dayLabelShort"
          />
          <MiscEntry
            v-else-if="entry.entryType === 'misc'"
            :entry="(entry as MiscEntryType)"
            :day-label-short="dayLabelShort"
          />
        </template>
      </ul>

      <p v-else class="layout-monthday--empty">On {{ dayLabelShort }}, the band rests.</p>
    </main>
  </article>
  <FooterBar />
</template>

<style scoped>
.layout-monthday {
  max-width: 33em;
  margin: 0 auto;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;

  a {
    margin-right: 0.2em;
  }

  > main {
    width: 100%;
    margin: 1em auto;
    border-radius: 1em;
    box-shadow: -0.2em -0.1em 0.3em 0.1em #fff6 inset;
    color: #ddd;
    background: #6666;
  }

  main > h1 {
    margin: 0.5em 0.1em 0.3em;
    text-align: center;

    a {
      text-decoration: none;
    }
  }

  .layout-monthday--birthday {
    display: block;
    font-size: 1.2em;
    text-align: center;
  }

  main > ul {
    margin: 2em 1em;

    /* :deep() is required because <li> elements are rendered inside child components */
    :deep(li) {
      margin: 0.5em 0.5em 1em 0.5em;
      padding-left: 1em;
      list-style: outside;
      list-style-type: '🤘';
      line-height: 1.5em;

      &.misc {
        list-style-type: '📍';
      }

      &.release {
        list-style-type: '💿';
      }
    }
  }

  .layout-monthday--empty {
    margin: 3em 1em;
    color: #666;
    text-align: center;
  }

  /* :deep() is required to reach into child component DOM for these scoped styles */
  :deep(.layout--entry-concert-kglw .layout--entry--artist) {
    display: none;
  }

  :deep(.layout--entry-concert-other .layout--entry--artist::after) {
    content: ' performed ';
  }

  :deep(.layout-monthday--entry--note) {
    margin: 0.5em;
    cursor: pointer;
  }

  > nav {
    width: 100%;
    order: -1;
    margin: 0;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;

    a {
      padding: 1em 2em;
    }
  }
}

.layout-monthday-sparse {
  > main {
    margin: 0;
    box-shadow: none;
    background: transparent;

    > h1 {
      margin-top: 0;
      font-size: 1.75em;
    }

    ul {
      margin-bottom: 0;
    }

    .layout-monthday--empty {
      margin-top: 1em;
    }
  }

  & + footer,
  > nav {
    display: none;
  }
}
</style>
