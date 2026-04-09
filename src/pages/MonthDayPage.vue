<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'
import { dateToText, slugToMonthDay, adjacentSlugs } from '@/utils/date'
import {
  showsForDay,
  albumsForDay,
  birthdaysForDay,
  miscForDay,
  showNotesForDay,
} from '@/utils/data'

const route = useRoute()
const md = new MarkdownIt()

// Detect ?ui=sparse after mount (client-side only — not available during SSR)
const isSparseLayout = ref(false)
onMounted(() => {
  isSparseLayout.value = window.location.search === '?ui=sparse'
})

const monthDay = computed(() => {
  const slug = route.params.monthday as string
  return slugToMonthDay(slug)
})

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

const prevSlug = computed(() => adjacentSlugs(route.params.monthday as string).prev)
const nextSlug = computed(() => adjacentSlugs(route.params.monthday as string).next)

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

// Build a UTM-tagged URL to a kglw.net setlist page
function setlistUrl(permalink: string, month: number, day: number): string {
  const monthPadded = String(month).padStart(2, '0')
  const dayPadded = String(day).padStart(2, '0')
  return `https://kglw.net/setlists/${permalink}?src=kglw.today&campaign=${monthPadded}-${dayPadded}`
}

interface Entry {
  // Fractional year used for chronological sort: year.showorder (e.g. 2019.2 for second show)
  sortKey: number
  entryType: 'concert-kglw' | 'concert-other' | 'release' | 'misc'
  id: string
}

interface ConcertEntry extends Entry {
  entryType: 'concert-kglw' | 'concert-other'
  artist: string
  showYear: number
  showOrder: number
  permalink: string
  venuename: string
  city: string
  country: string
  notes: string | null
}

interface AlbumEntry extends Entry {
  entryType: 'release'
  year: number
  name: string
  releaseType: string | undefined
  note: string | undefined
  url: string | undefined
}

interface MiscEntry extends Entry {
  entryType: 'misc'
  year: number
  htmlContent: string
}

type AnyEntry = ConcertEntry | AlbumEntry | MiscEntry

const sortedEntries = computed((): AnyEntry[] => {
  const parsed = monthDay.value
  if (!parsed) return []

  const concertEntries: ConcertEntry[] = dayShows.value.map((show) => {
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

  const albumEntries: AlbumEntry[] = dayAlbums.value.map((album) => ({
    sortKey: album.year,
    entryType: 'release',
    id: `${album.year}-release-${album.type}-${album.name}`,
    year: album.year,
    name: album.name,
    releaseType: album.type,
    note: album.note,
    url: album.url,
  }))

  const miscEntries: MiscEntry[] = dayMisc.value.map((event, index) => ({
    sortKey: event.year,
    entryType: 'misc',
    // Use index as tie-breaker since SHA is async — content is unique enough with year prefix
    id: `${event.year}-misc-${index}`,
    year: event.year,
    htmlContent: md.renderInline(event.what),
  }))

  return [...concertEntries, ...albumEntries, ...miscEntries].sort(
    (entryA, entryB) => entryA.sortKey - entryB.sortKey,
  )
})
</script>

<template>
  <head>
    <title>{{ pageTitle }}</title>
  </head>

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
          <!-- Concert entry -->
          <li
            v-if="entry.entryType === 'concert-kglw' || entry.entryType === 'concert-other'"
            :class="[`layout--entry-concert`, `layout--entry-concert-${entry.entryType === 'concert-kglw' ? 'kglw' : 'other'}`, 'layout-monthday--entry']"
          >
            <span class="layout--entry--artist">{{ (entry as ConcertEntry).artist }}</span>
            <a
              :href="setlistUrl((entry as ConcertEntry).permalink, monthDay!.month, monthDay!.day)"
              target="_blank"
              rel="noreferrer"
            >
              {{ (entry as ConcertEntry).showYear }} {{ dayLabelShort }} @
              {{ (entry as ConcertEntry).venuename
              }}{{ (entry as ConcertEntry).showOrder === 1
                ? `, ${(entry as ConcertEntry).city}, ${(entry as ConcertEntry).country}`
                : ` [show ${(entry as ConcertEntry).showOrder}]` }}
            </a>
            <span
              v-if="(entry as ConcertEntry).notes"
              class="layout-monthday--entry--note"
              :title="(entry as ConcertEntry).notes ?? undefined"
            >📝</span>
          </li>

          <!-- Album release entry -->
          <li
            v-else-if="entry.entryType === 'release'"
            class="release layout-monthday--entry"
          >
            {{ (entry as AlbumEntry).year }} {{ dayLabelShort }}:
            <wbr />
            <a
              v-if="(entry as AlbumEntry).url"
              :href="(entry as AlbumEntry).url"
              target="_blank"
              rel="noreferrer"
            >
              <cite>{{ (entry as AlbumEntry).name }}</cite>{{ (entry as AlbumEntry).releaseType ? ` ${(entry as AlbumEntry).releaseType}` : '' }}
            </a>
            <template v-else>
              <cite>{{ (entry as AlbumEntry).name }}</cite>{{ (entry as AlbumEntry).releaseType ? ` ${(entry as AlbumEntry).releaseType}` : '' }}
            </template>
            released
            <span
              v-if="(entry as AlbumEntry).note"
              class="layout-monthday--entry--note"
              :title="(entry as AlbumEntry).note"
            >📝</span>
          </li>

          <!-- Misc historical event entry -->
          <li
            v-else-if="entry.entryType === 'misc'"
            class="misc layout-monthday--entry"
          >
            {{ (entry as MiscEntry).year }} {{ dayLabelShort }}:
            <wbr />
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="(entry as MiscEntry).htmlContent" />
          </li>
        </template>
      </ul>

      <p v-else class="layout-monthday--empty">On {{ dayLabelShort }}, the band rests.</p>
    </main>
  </article>
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

    li {
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

  .layout--entry-concert-kglw .layout--entry--artist {
    display: none;
  }

  .layout--entry-concert-other .layout--entry--artist::after {
    content: ' performed ';
  }

  .layout-monthday--entry--note {
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
