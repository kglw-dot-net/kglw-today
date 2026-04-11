import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import MarkdownIt from 'markdown-it'

import Layout from '../components/layout'
import { dateToText } from '../helpers'

import showsData from '../data/shows.json'
import albumsData from '../data/albums.json'
import birthdaysData from '../data/birthdays.json'
import miscData from '../data/misc.json'
import showNotesData from '../data/show-notes.json'

const md = MarkdownIt()

// Parse a month-day slug like 'jan-1' or 'feb-29' into { month, day }.
// Month uses 1=January, 12=December to match the source data convention.
function parseMonthDaySlug(slug) {
  const formatted = slug.replace('-', ' ') // 'jan-1' → 'jan 1'
  const date = new Date(`${formatted} 2000`)
  if (isNaN(date.getTime())) return null
  return { month: date.getMonth() + 1, day: date.getDate() }
}

export function getStaticPaths() {
  const paths = []

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
  const seenSlugs = new Set()
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

export function getStaticProps({ params }) {
  const slug = params.slug[0]

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

export default function SlugPage(props) {
  if (props.pageType === 'redirect') {
    return <RedirectPage redirectTo={props.redirectTo} />
  }
  return <MonthDayPage {...props} />
}

function RedirectPage({ redirectTo }) {
  return <>
    <Head>
      <meta httpEquiv="refresh" content={`0; URL=${redirectTo}`} />
    </Head>
    <p>Redirecting to <a href={redirectTo}>{redirectTo}</a></p>
  </>
}

function MonthDayPage({ month, day, prevSlug, prevLabel, nextSlug, nextLabel, showsOnDay, albumsOnDay, birthdaysOnDay, miscOnDay, notesOnDay }) {
  const [isSparseLayout, setSparseLayout] = useState(false)
  useEffect(() => {
    setSparseLayout(window.location.search === '?ui=sparse')
  }, [])

  const dateObj = new Date(2000, month - 1, day)
  const theDayShort = dateToText(dateObj)
  const theDayLong = dateToText(dateObj, { month: 'long' })

  const notesByYear = notesOnDay.reduce((acc, { year, note }) => {
    if (!acc[year]) acc[year] = []
    acc[year].push(note)
    return acc
  }, {})

  const concertsMapping = showsOnDay.map(({ show_id, artist, showorder, show_year, permalink, venuename, city, country }) => {
    const notes = notesByYear[show_year]?.join('; ')
    const monthPadded = String(month).padStart(2, '0')
    const dayPadded = String(day).padStart(2, '0')
    const isKglw = artist.startsWith('King Gizzard')
    return {
      key: `${show_year}-concert-${show_id}`,
      year: Number(`${show_year}.${showorder}`),
      className: `layout--entry-concert layout--entry-concert-${isKglw ? 'kglw' : 'other'}`,
      content: <>
        <span className="layout--entry--artist">{artist}</span>
        {!isKglw && ' performed '}
        <a
          href={`https://kglw.net/setlists/${permalink}?src=kglw.today&campaign=${monthPadded}-${dayPadded}`}
          target="_blank"
          rel="noreferrer"
        >
          {show_year} {theDayShort} @ {venuename}{showorder === 1 ? `, ${city}, ${country}` : ` [show ${showorder}]`}
        </a>
        {notes && <span className="layout-monthday--entry--note" title={notes}>📝</span>}
      </>,
    }
  })

  const albumsMapping = albumsOnDay.map(({ year, name, type, note, url }) => {
    const entry = <><cite>{name}</cite>{type ? ` ${type}` : null}</>
    return {
      key: `${year}-release-${type}-${name}`,
      year: Number(year),
      className: 'release',
      content: <>
        {year} {theDayShort}:{' '}
        <wbr />
        {url
          ? <a href={url} target="_blank" rel="noreferrer">{entry}</a>
          : entry
        } released {note && <span className="layout-monthday--entry--note" title={note}>📝</span>}
      </>,
    }
  })

  const miscMapping = miscOnDay.map(({ year, what }, index) => ({
    key: `${year}-misc-${index}`,
    year: Number(year),
    className: 'misc',
    content: <>
      {year} {theDayShort}:{' '}
      <wbr />
      <span dangerouslySetInnerHTML={{ __html: md.renderInline(what) }} />
    </>,
  }))

  const entriesSorted = [...concertsMapping, ...albumsMapping, ...miscMapping]
    .sort((a, b) => a.year - b.year)

  return <>
    <Head>
      <title>{theDayLong} in King Gizzard History</title>
    </Head>
    <Layout className={`layout-monthday${isSparseLayout ? ' layout-monthday-sparse' : ''}`}>
      <main>
        <h1>
          {theDayLong} <br /> in <br />
          <a href="https://kglw.today" target="_blank" rel="noreferrer">
            King Gizzard <br /> History
          </a>
        </h1>

        {birthdaysOnDay.map(({ year, who }) =>
          <em key={`${year}-${who}`} className="layout-monthday--birthday">Happy Birthday to {who}!!</em>
        )}

        {entriesSorted.length
          ? <ul>
            {entriesSorted.map((entry) =>
              <li key={entry.key} className={`${entry.className} layout-monthday--entry`}>
                {entry.content}
              </li>
            )}
          </ul>
          : <p className="layout-monthday--empty">On {theDayShort}, the band rests.</p>
        }
      </main>

      <nav>
        <a className="nav-prev" href={`/${prevSlug}`}>{prevLabel}</a>
        <a className="nav-next" href={`/${nextSlug}`}>{nextLabel}</a>
      </nav>
    </Layout>
  </>
}
