import React, { useEffect, useState } from 'react'
import Head from 'next/head'

import Layout from '../components/layout'
import Calendar from '../components/calendar'
import MonthDayContent from '../components/month-day-content'
import type { MonthDayContentProps } from '../components/month-day-content'
import { dateToSlug, dateToText } from '../helpers'
import type { Show, Album, Birthday, Misc, ShowNote } from '../types/data'
// index.scss is imported globally from _app.tsx

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

function buildMonthDayProps(date: Date): MonthDayContentProps {
  const month = date.getMonth() + 1
  const day = date.getDate()

  const prevDate = new Date(2000, month - 1, day)
  prevDate.setDate(prevDate.getDate() - 1)
  const nextDate = new Date(2000, month - 1, day)
  nextDate.setDate(nextDate.getDate() + 1)

  return {
    month,
    day,
    prevSlug: dateToSlug(prevDate),
    prevLabel: dateToText(prevDate),
    nextSlug: dateToSlug(nextDate),
    nextLabel: dateToText(nextDate),
    showsOnDay: showsData.filter((s) => s.show_month === month && s.show_day === day),
    albumsOnDay: albumsData.filter((a) => a.month === month && a.day === day),
    birthdaysOnDay: birthdaysData.filter((b) => b.month === month && b.day === day),
    miscOnDay: miscData.filter((m) => m.month === month && m.day === day),
    notesOnDay: showNotesData.filter((n) => n.month === month && n.day === day),
  }
}

export default function IndexPage() {
  const [todayDate, setDate] = useState<Date | null>(null)
  useEffect(() => {
    // Intentional: defer to client to avoid SSR hydration mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDate(new Date())
  }, [])

  return <>
    <Head>
      <title>Today in King Gizzard History</title>
    </Head>
    <Layout className="layout-index layout-monthday">
      {todayDate
        ? <MonthDayContent {...buildMonthDayProps(todayDate)} />
        : <>
          <h1>Today in King Gizzard History</h1>
          <Calendar />
        </>
      }
    </Layout>
  </>
}
