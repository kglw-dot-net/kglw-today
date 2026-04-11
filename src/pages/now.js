import React, { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
// now.scss is imported globally from _app.js

const dateObjToMonthDaySlug = (dateObj) =>
  dateObj?.toDateString().split(/ 0?/).slice(1, 3).join(' ')?.toLowerCase().replace(' ', '-')

export default function NowPage() {
  const [todayDate, setDate] = useState(null)
  useEffect(() => {
    setDate(new Date())
  }, [])

  const iframeSrc = useMemo(
    () => todayDate && `/${dateObjToMonthDaySlug(todayDate)}?ui=sparse`,
    [todayDate]
  )

  return <>
    <Head>
      <title>Right Now in King Gizzard History</title>
    </Head>
    <noscript>This requires JavaScript to determine what day it is for you.</noscript>
    <iframe src={iframeSrc} title="Right Now in King Gizzard History" style={{ width: '100vw', height: '100vh', border: 0 }} />
  </>
}
