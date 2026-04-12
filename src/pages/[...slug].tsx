import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import type { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'

import Layout from '../components/layout'
import MonthDayContent from '../components/month-day-content'
import { dateToText } from '../helpers'
import type { Show, Album, Birthday, Misc, ShowNote } from '../types/data'

// Type-assert JSON imports to avoid slow inference on large files
import showsDataJson from '../data/shows.json'
import albumsDataJson from '../data/albums.json'
import birthdaysDataJson from '../data/birthdays.json'
import miscDataJson from '../data/misc.json'
import showNotesDataJson from '../data/show-notes.json'

const showsData = showsDataJson as unknown as Show[]
const albumsData = albumsDataJson as unknown as Album[]
const birthdaysData = birthdaysDataJson as unknown as Birthday[]
const miscData = miscDataJson as unknown as Misc[]
const showNotesData = showNotesDataJson as unknown as ShowNote[]

// Parse a month-day slug like 'jan-1' or 'feb-29' into { month, day }.
// Month uses 1=January, 12=December to match the source data convention.
function parseMonthDaySlug(slug: string): { month: number; day: number } | null {
  const formatted = slug.replace('-', ' ') // 'jan-1' → 'jan 1'
  const date = new Date(`${formatted} 2000`)
  if (isNaN(date.getTime())) return null
  return { month: date.getMonth() + 1, day: date.getDate() }
}

// ---------------------------------------------------------------------------
// Page prop types
// ---------------------------------------------------------------------------

type RedirectProps = {
  pageType: 'redirect'
  redirectTo: string
}

type MonthDayProps = {
  pageType: 'monthday'
  month: number
  day: number
  prevSlug: string
  prevLabel: string
  nextSlug: string
  nextLabel: string
  showsOnDay: Show[]
  albumsOnDay: Album[]
  birthdaysOnDay: Birthday[]
  miscOnDay: Misc[]
  notesOnDay: ShowNote[]
}

type SlugPageProps = RedirectProps | MonthDayProps

// ---------------------------------------------------------------------------
// Static generation
// ---------------------------------------------------------------------------

export const getStaticPaths: GetStaticPaths = () => {
  const paths: Array<{ params: { slug: string[] } }> = []

  // 366 month-day pages — iterate through year 2000 (a leap year) for complete coverage
  for (
    let date = new Date(2000, 0, 1);
    date.getFullYear() === 2000;
    date.setDate(date.getDate() + 1)
  ) {
    const slug = dateToText(date).toLowerCase().replace(' ', '-')
    paths.push({ params: { slug: [slug] } })
  }

  // Show redirect pages: one per YYYY-MM-DD (first show of day) and one per YYYY-MM-DD@N.
  // Deduplicate both forms — the source data can have multiple rows per date/order.
  const seenSlugs = new Set<string>()
  for (const show of showsData) {
    const dateSlug = show.showdate // YYYY-MM-DD

    if (!seenSlugs.has(dateSlug)) {
      seenSlugs.add(dateSlug)
      paths.push({ params: { slug: [dateSlug] } })
    }

    const slugWithOrder = `${dateSlug}@${show.showorder}`
    if (!seenSlugs.has(slugWithOrder)) {
      seenSlugs.add(slugWithOrder)
      paths.push({ params: { slug: [slugWithOrder] } })
    }
  }

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<SlugPageProps, { slug: string[] }> = ({ params }) => {
  const slug = params!.slug[0]

  // YYYY-MM-DD or YYYY-MM-DD@N → redirect to kglw.net setlist
  if (/^\d{4}-\d{2}-\d{2}/.test(slug)) {
    const [datePart, orderPart] = slug.split('@')
    const targetOrder = orderPart ? parseInt(orderPart, 10) : 1
    const show = showsData.find(
      (s) => s.showdate === datePart && s.showorder === targetOrder
    )
    if (!show) return { notFound: true }
    const redirectTo = `https://kglw.net/setlists/${show.permalink}?src=kglw.today&campaign=${slug}`
    return { props: { pageType: 'redirect', redirectTo } }
  }

  // Month-day slug (e.g. 'apr-11')
  const parsed = parseMonthDaySlug(slug)
  if (!parsed) return { notFound: true }
  const { month, day } = parsed

  // Compute adjacent day slugs for prev/next navigation
  const prevDate = new Date(2000, month - 1, day)
  prevDate.setDate(prevDate.getDate() - 1)
  const nextDate = new Date(2000, month - 1, day)
  nextDate.setDate(nextDate.getDate() + 1)

  return {
    props: {
      pageType: 'monthday',
      month,
      day,
      prevSlug: dateToText(prevDate).toLowerCase().replace(' ', '-'),
      prevLabel: dateToText(prevDate),
      nextSlug: dateToText(nextDate).toLowerCase().replace(' ', '-'),
      nextLabel: dateToText(nextDate),
      showsOnDay: showsData.filter((s) => s.show_month === month && s.show_day === day),
      albumsOnDay: albumsData.filter((a) => a.month === month && a.day === day),
      birthdaysOnDay: birthdaysData.filter((b) => b.month === month && b.day === day),
      miscOnDay: miscData.filter((m) => m.month === month && m.day === day),
      notesOnDay: showNotesData.filter((n) => n.month === month && n.day === day),
    },
  }
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function SlugPage(props: SlugPageProps) {
  if (props.pageType === 'redirect') {
    return <RedirectPage redirectTo={props.redirectTo} />
  }
  return <MonthDayPage {...props} />
}

function RedirectPage({ redirectTo }: { redirectTo: string }) {
  return <>
    <Head>
      <meta httpEquiv="refresh" content={`0; URL=${redirectTo}`} />
    </Head>
    <p>Redirecting to <a href={redirectTo}>{redirectTo}</a></p>
  </>
}

function MonthDayPage(props: MonthDayProps) {
  const [isSparseLayout, setSparseLayout] = useState(false)
  useEffect(() => {
    // Intentional: window.location is client-only; defer to avoid SSR hydration mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSparseLayout(window.location.search === '?ui=sparse')
  }, [])

  const theDayLong = dateToText(new Date(2000, props.month - 1, props.day), { month: 'long' })

  return <>
    <Head>
      <title>{`${theDayLong} in King Gizzard History`}</title>
    </Head>
    <Layout className={`layout-monthday${isSparseLayout ? ' layout-monthday-sparse' : ''}`}>
      <MonthDayContent {...props} />
      <nav>
        <Link href="/calendar">Calendar of all dates</Link>
      </nav>
    </Layout>
  </>
}
