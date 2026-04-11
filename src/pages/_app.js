import React from 'react'
import GoatCounter from '../components/goat-counter'
// Global styles must all be imported here in Next.js (not in individual components/pages)
import './index.scss'
import '../components/footer.scss'
import '../styles/month-day.scss'
import './now.scss'

export default function App({ Component, pageProps }) {
  return <>
    <GoatCounter />
    <Component {...pageProps} />
  </>
}
