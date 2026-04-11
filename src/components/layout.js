import React from 'react'
import Footer from './footer'

export default function Layout({ children, ...props }) {
  return <>
    <article {...props}>
      {children}
    </article>
    <Footer />
  </>
}
