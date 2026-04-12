import React from 'react'
import Head from 'next/head'
import Calendar from '../components/calendar'
import Layout from '../components/layout'

export default function CalendarPage() {
  return <>
    <Head>
      <title>King Gizzard History Calendar</title>
    </Head>
    <Layout className="layout-calendar">
      <h1>King Gizzard History Calendar</h1>
      <Calendar />
    </Layout>
  </>
}
