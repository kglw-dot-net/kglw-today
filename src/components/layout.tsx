import React from 'react'
import Footer from './footer'

type Props = React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>

export default function Layout({ children, ...props }: Props) {
  return <>
    <article {...props}>
      {children}
    </article>
    <Footer />
  </>
}
