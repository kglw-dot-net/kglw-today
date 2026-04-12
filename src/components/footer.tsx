import React from 'react'
import Link from 'next/link'
import CodeIcon from '../images/svg/icon-source-code.svg'
// footer.scss is imported globally from _app.tsx

export default function Footer() {
  return <footer className="sitefooter">

    <nav>
      <Link href="/">Calendar of all dates</Link>
    </nav>

    <p>Brought to you by <a href="http://kglw.net/?src=kglw.today&campaign=credits" target="_blank" rel="noreferrer">KGLW.net</a>!</p>
    <p>
      <a className="sitefooter__source" href="https://github.com/kglw-dot-net/kglw-today" title="source code on GitHub">
        <span className="sitefooter__icon"><CodeIcon /></span>
        code is open source
      </a>
    </p>

  </footer>
}
