import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'

import { defineConfig } from 'vite'
// Importing ViteSSGOptions activates vite-ssg's `declare module 'vite'` augmentation,
// which adds `ssgOptions` to Vite's UserConfig type so defineConfig accepts it.
import type { ViteSSGOptions } from 'vite-ssg'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// ---------------------------------------------------------------------------
// Route generation helpers (run at build time in Node.js, not in the browser)
// ---------------------------------------------------------------------------

/** Month abbreviations matching the browser's Intl output for 'en' locale */
const MONTH_ABBREVS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

/** Produce the URL slug for a calendar date, e.g. "jan-1", "dec-31" */
function buildCalendarSlug(monthIndex: number, day: number): string {
  return `${MONTH_ABBREVS[monthIndex]}-${day}`
}

/** All 366 calendar day paths using year 2000 as reference (leap year) */
function allCalendarPaths(): string[] {
  const paths: string[] = []
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const daysInMonth = new Date(2000, monthIndex + 1, 0).getDate()
    for (let day = 1; day <= daysInMonth; day++) {
      paths.push(`/${buildCalendarSlug(monthIndex, day)}`)
    }
  }
  return paths
}

interface ShowRecord {
  showdate: string
  showorder: number
}

/** All show date paths: "/YYYY-MM-DD" and "/YYYY-MM-DD@N" for each show */
function allShowPaths(): string[] {
  const showsJson = readFileSync(
    fileURLToPath(new URL('./src/data/shows.json', import.meta.url)),
    'utf-8',
  )
  const shows: ShowRecord[] = JSON.parse(showsJson)

  // Use a Set to deduplicate plain date paths (multiple shows on same date
  // all get the same "/:showdate" URL that resolves to showorder 1).
  const plainDatesSeen = new Set<string>()
  const paths: string[] = []

  for (const show of shows) {
    if (!plainDatesSeen.has(show.showdate)) {
      paths.push(`/${show.showdate}`)
      plainDatesSeen.add(show.showdate)
    }
    paths.push(`/${show.showdate}@${show.showorder}`)
  }

  return paths
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ssgOptions: {
    script: 'async',
    // Don't minify HTML — the minifier strips spaces adjacent to <br> elements,
    // which breaks text content that tests and screen readers depend on.
    // JS/CSS assets are still minified by Vite's normal build pipeline.
    includedRoutes(existingPaths) {
      return [
        ...existingPaths,
        ...allCalendarPaths(),
        ...allShowPaths(),
      ]
    },
  },
})
