import React, { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
// now.scss is imported globally from _app.tsx

const dateObjToMonthDaySlug = (dateObj: Date): string =>
  dateObj.toDateString().split(/ 0?/).slice(1, 3).join(' ').toLowerCase().replace(' ', '-')

export default function NowPage() {
  const [todayDate, setDate] = useState<Date | null>(null)
  useEffect(() => {
    // Intentional: defer to client to avoid SSR hydration mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDate(new Date())
  }, [])

  const iframeSrc = useMemo(
    () => todayDate ? `/${dateObjToMonthDaySlug(todayDate)}?ui=sparse` : null,
    [todayDate]
  )

  return <>
    <Head>
      <title>Right Now in King Gizzard History</title>
    </Head>
    <noscript>This requires JavaScript to determine what day it is for you.</noscript>
    <iframe src={iframeSrc ?? undefined} title="Right Now in King Gizzard History" style={{ width: '100vw', height: '100vh', border: 0 }} />
  </>
}
