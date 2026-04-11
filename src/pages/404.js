import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function NotFoundPage() {
  return <>
    <Head>
      <title>Not found</title>
    </Head>
    <main>
      <h1>Page not found</h1>
      <p>
        Sorry, we couldn't find what you were looking for.
        <br />
        <br />
        <Link href="/">Go home</Link>.
      </p>
    </main>
  </>
}
