import React from 'react'
import CodeIcon from '../images/svg/icon-source-code.svg'
import './footer.scss'

export default function Footer() {
  return <footer className="sitefooter">

    <nav>
      <a href="/">Back to Today / full Calendar</a>
    </nav>

    <p>Brought to you by <a href="http://kglw.net/?src=kglw.today&campaign=credits" target="_blank" rel="noreferrer">KGLW.net</a>!</p>
    <p>
      <a className="sitefooter__source" href="https://github.com/kglw-dot-net/kglw-today" title="source code on GitHub">
        <CodeIcon alt="" />
        code is open source
      </a>
    </p>

  </footer>
}
