# notes

## Vue.js Port Plan: kglw.today

...authored by [Claude](https://claude.com)

### Overview

The existing Gatsby/React site generates static pages from JSON data at build time using
GraphQL. The Vue port will use Vite + Vue Router with JSON imported directly, and vite-ssg
(or @vitejs/plugin-vue + manual prerendering) to produce fully static HTML for GitHub Pages
deployment.

### Recommended Stack Additions

┌──────────────────────┬─────────────────────────────────────────────────────────────────┐
│         Tool         │                             Purpose                             │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ vite-ssg             │ Static site generation — prerenders all routes to HTML at build │
│                      │  time                                                           │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ vue-router           │ Already present; will be route-based for all pages              │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ marked or            │ Render markdown in misc.json entries                            │
│ markdown-it          │                                                                 │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ No GraphQL needed    │ Import JSON files directly via Vite's static asset handling     │
└──────────────────────┴─────────────────────────────────────────────────────────────────┘

### Routes

┌───────────────────────────┬──────────────┬──────────────────────────────────────────────┐
│           Route           │  Component   │                    Notes                     │
├───────────────────────────┼──────────────┼──────────────────────────────────────────────┤
│ /                         │ HomePage     │ Calendar of all 365 days, highlights today   │
│                           │              │ (client-side)                                │
├───────────────────────────┼──────────────┼──────────────────────────────────────────────┤
│ /now                      │ NowPage      │ Iframe to today's month-day page with        │
│                           │              │ ?ui=sparse                                   │
├───────────────────────────┼──────────────┼──────────────────────────────────────────────┤
│ /[month-day]              │ MonthDayPage │ e.g. /jan-1, /dec-31 — one per calendar day  │
├───────────────────────────┼──────────────┼──────────────────────────────────────────────┤
│ /:year-:month-:day        │ ShowRedirect │ Redirects to kglw.net setlist pages          │
├───────────────────────────┼──────────────┼──────────────────────────────────────────────┤
│ /:year-:month-:day@:order │ ShowRedirect │ Same, with show order                        │
├───────────────────────────┼──────────────┼──────────────────────────────────────────────┤
│ /:pathMatch(.*)           │ NotFoundPage │ 404 catch-all                                │
└───────────────────────────┴──────────────┴──────────────────────────────────────────────┘

All 366 month-day routes + all show-date redirect routes need to be pre-rendered to static
HTML via vite-ssg.

### Data Loading Strategy

All 5 JSON files (shows.json, albums.json, birthdays.json, misc.json, show-notes.json) live
in src/data/. Vite can import them directly:

import shows from '@/data/shows.json'

A src/data/index.ts module will handle filtering helpers (by month+day, by date string) so
components stay clean.

### Static Generation & GitHub Pages

1. Install vite-ssg — replaces vite build with vite-ssg build, which crawls the router and
prerenders every route
2. Configure vite.config.ts with base: '/' (or the repo name if deployed to a subpath)
3. Generate route list — gatsby-node.js dynamically created 366 + N redirect pages; vite-ssg
needs a static route list exported from the router (or from a routes generator script)
4. GitHub Actions — vite-ssg build → deploy dist/ to gh-pages branch

### Components to Build

┌──────────────────┬───────────────────────┬─────────────────────────────────────────────┐
│    Component     │         From          │                    Notes                    │
├──────────────────┼───────────────────────┼─────────────────────────────────────────────┤
│ AppLayout.vue    │ layout.js             │ Wraps <article>, includes footer            │
├──────────────────┼───────────────────────┼─────────────────────────────────────────────┤
│ FooterBar.vue    │ footer.js             │ "Back to Calendar" + credits + GitHub icon  │
├──────────────────┼───────────────────────┼─────────────────────────────────────────────┤
│ GoatCounter.vue  │ goat-counter.js       │ Analytics, prod-only, custom path tracking  │
├──────────────────┼───────────────────────┼─────────────────────────────────────────────┤
│ CalendarGrid.vue │ inline in index.js    │ 365-day grid with today highlighted         │
├──────────────────┼───────────────────────┼─────────────────────────────────────────────┤
│ EventList.vue    │ inline in             │ Albums, shows, birthdays, misc for a given  │
│                  │ month-day.js          │ day                                         │
├──────────────────┼───────────────────────┼─────────────────────────────────────────────┤
│ ShowNote.vue     │ inline in             │ Icon + tooltip for performance notes        │
│                  │ month-day.js          │                                             │
├──────────────────┼───────────────────────┼─────────────────────────────────────────────┤
│ DayNav.vue       │ inline in             │ Previous/next day arrows                    │
│                  │ month-day.js          │                                             │
└──────────────────┴───────────────────────┴─────────────────────────────────────────────┘

### Helper Functions to Port

src/helpers.js → src/utils/date.ts:
- dateToText(date, opts) — format date as "Jan 1"
- dateToSlug(date) — format as "jan-1" for URLs
- stringToSHA(message) — async SHA-256 for misc event keys

### Key Behaviors to Preserve

- Sparse UI mode — ?ui=sparse query param on month-day pages hides chrome
- Campaign tracking — outbound links to kglw.net include UTM params
- Today highlighting — calculated client-side on mount (not at build time)
- Markdown in misc events — rendered inline
- Color-coding — KGLW shows vs other artists

### Suggested Build Order

1. Install vite-ssg, configure Vite base path, wire up router
2. Port src/data/ JSON + write filtering helpers
3. Build MonthDayPage (the core content page)
4. Build HomePage with CalendarGrid
5. Build NowPage (iframe)
6. Build ShowRedirect (client-side redirect)
7. Build shared components (Layout, Footer, GoatCounter)
8. Set up GitHub Actions deploy workflow
