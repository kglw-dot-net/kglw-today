import React from 'react'
import c from 'clsx'
import MarkdownIt from 'markdown-it'
import { dateToText } from '../helpers'
import type { Show, Album, Birthday, Misc, ShowNote } from '../types/data'

const md = MarkdownIt()

export type MonthDayContentProps = {
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

export default function MonthDayContent({
  month, day,
  prevSlug, prevLabel,
  nextSlug, nextLabel,
  showsOnDay, albumsOnDay, birthdaysOnDay, miscOnDay, notesOnDay,
}: MonthDayContentProps) {
  const dateObj = new Date(2000, month - 1, day)
  const theDayShort = dateToText(dateObj)
  const theDayLong = dateToText(dateObj, { month: 'long' })

  const notesByYear = notesOnDay.reduce<Record<number, string[] | undefined>>((acc, { year, note }) => {
    const existing = acc[year]
    if (existing) {
      existing.push(note)
    } else {
      acc[year] = [note]
    }
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
            <li key={entry.key} className={c(entry.className, 'layout-monthday--entry')}>
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
  </>
}
