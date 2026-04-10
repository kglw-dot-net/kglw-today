export interface ConcertEntry {
  // Fractional year used for chronological sort: year.showorder (e.g. 2019.2 for second show)
  sortKey: number
  entryType: 'concert-kglw' | 'concert-other'
  id: string
  artist: string
  showYear: number
  showOrder: number
  permalink: string
  venuename: string
  city: string
  country: string
  notes: string | null
}

interface Props {
  entry: ConcertEntry
  dayLabelShort: string
  month: number
  day: number
}

function setlistUrl(permalink: string, month: number, day: number): string {
  const monthPadded = String(month).padStart(2, '0')
  const dayPadded = String(day).padStart(2, '0')
  return `https://kglw.net/setlists/${permalink}?src=kglw.today&campaign=${monthPadded}-${dayPadded}`
}

export default function ConcertEntry({ entry, dayLabelShort, month, day }: Props) {
  const isKglw = entry.entryType === 'concert-kglw'
  const className = [
    'layout--entry-concert',
    isKglw ? 'layout--entry-concert-kglw' : 'layout--entry-concert-other',
    'layout-monthday--entry',
  ].join(' ')

  return (
    <li className={className}>
      <span className="layout--entry--artist">{entry.artist}</span>
      <a
        href={setlistUrl(entry.permalink, month, day)}
        target="_blank"
        rel="noreferrer"
      >
        {entry.showYear} {dayLabelShort} @ {entry.venuename}
        {entry.showOrder === 1
          ? `, ${entry.city}, ${entry.country}`
          : ` [show ${entry.showOrder}]`}
      </a>
      {entry.notes && (
        <span className="layout-monthday--entry--note" title={entry.notes}>
          📝
        </span>
      )}
    </li>
  )
}
