import MarkdownIt from 'markdown-it'

export interface MiscEntry {
  sortKey: number
  entryType: 'misc'
  id: string
  year: number
  // Raw markdown text from the data source; rendered to inline HTML by this component
  markdownContent: string
}

interface Props {
  entry: MiscEntry
  dayLabelShort: string
}

const md = new MarkdownIt()

export default function MiscEntry({ entry, dayLabelShort }: Props) {
  return (
    <li className="misc layout-monthday--entry">
      {entry.year} {dayLabelShort}:{' '}
      <wbr />
      <span dangerouslySetInnerHTML={{ __html: md.renderInline(entry.markdownContent) }} />
    </li>
  )
}
