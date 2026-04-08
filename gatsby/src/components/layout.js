import React from 'react'

import GoatCounter from './goat-counter';
import Footer from './footer';

export const Head = () => <>
  <GoatCounter />
</>

export default function Layout({children, ...props}) {
  return <>
    <article {...props}>
      {children}
    </article>
    <Footer/>
  </>
}
