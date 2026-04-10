export interface AlbumEntry {
  sortKey: number
  entryType: 'release'
  id: string
  year: number
  name: string
  releaseType: string | undefined
  note: string | undefined
  url: string | undefined
}

interface Props {
  entry: AlbumEntry
  dayLabelShort: string
}

export default function AlbumEntry({ entry, dayLabelShort }: Props) {
  const releaseLabel = (
    <>
      <cite>{entry.name}</cite>
      {entry.releaseType ? ` ${entry.releaseType}` : ''}
    </>
  )

  return (
    <li className="release layout-monthday--entry">
      {entry.year} {dayLabelShort}:{' '}
      <wbr />
      {entry.url ? (
        <a href={entry.url} target="_blank" rel="noreferrer">
          {releaseLabel}
        </a>
      ) : (
        releaseLabel
      )}{' '}
      released
      {entry.note && (
        <span className="layout-monthday--entry--note" title={entry.note}>
          📝
        </span>
      )}
    </li>
  )
}
