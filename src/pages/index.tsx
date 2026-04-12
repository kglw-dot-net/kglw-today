import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/layout'
import Calendar from '../components/calendar'
import { dateToSlug, dateToText } from '../helpers'
// index.scss is imported globally from _app.tsx

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
      <Calendar />
    </Layout>
  </>
}
