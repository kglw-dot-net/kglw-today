import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'
import { dateToSlug, dateToText } from '../helpers'
// index.scss is imported globally from _app.tsx

export default function IndexPage() {
  const [todayDate, setDate] = useState<Date | null>(null)
  useEffect(() => {
    setDate(new Date())
  }, [])

  return <>
    <Head>
      <title>Today in King Gizzard History</title>
    </Head>
    <Layout className="layout-index">
      <h1>Today in King Gizzard History</h1>
      <p>
        {todayDate
          ? <>Today is <Link href={`/${dateToSlug(todayDate)}`}>{dateToText(todayDate)}</Link></>
          : <>Loading...
            <noscript><strong>This site requires JavaScript.</strong></noscript>
          </>
        }
      </p>
      <div className="calendar">
        <h2>Calendar</h2>
        <p>Pick a different day?</p>
        <ul>
          {Array(12).fill(null).map((_, indexMonth) => {
            const date = new Date(2000, indexMonth, 1)
            const monthName = dateToText(date, { month: 'long' }).split(' ')[0]
            return <li key={indexMonth}>
              <h3>{monthName}</h3>
              <ul>
                {Array(31).fill(null).map((_, indexDay) => {
                  date.setDate(indexDay + 1)
                  if (date.getMonth() === indexMonth) {
                    const isToday = todayDate && date.getMonth() === todayDate.getMonth() && date.getDate() === todayDate.getDate()
                    return <li key={indexDay}>
                      <a href={`/${dateToSlug(date)}`} className={isToday ? 'today' : ''}>
                        {dateToText(date)}
                      </a>
                    </li>
                  }
                  return null
                })}
              </ul>
            </li>
          })}
        </ul>
      </div>
    </Layout>
  </>
}
