// The SVG is inlined so its path fills can be styled with CSS.
import codeIconSvgRaw from '../assets/icon-source-code.svg?raw'

export default function FooterBar() {
  return (
    <footer className="sitefooter">
      <nav>
        <a href="/calendar">Back to Calendar</a>
      </nav>

      <p>
        Brought to you by{' '}
        <a href="http://kglw.net/?src=kglw.today&campaign=credits" target="_blank" rel="noreferrer">
          KGLW.net
        </a>!
      </p>

      <p>
        <a
          className="sitefooter__source"
          href="https://github.com/kglw-dot-net/kglw-today"
          title="source code on GitHub"
        >
          <span
            className="sitefooter__icon"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: codeIconSvgRaw }}
          />
          code is open source
        </a>
      </p>
    </footer>
  )
}
