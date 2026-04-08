import rawShows from '@/data/shows.json'
import rawAlbums from '@/data/albums.json'
import rawBirthdays from '@/data/birthdays.json'
import rawMisc from '@/data/misc.json'
import rawShowNotes from '@/data/show-notes.json'
import { slugToMonthDay, dateToSlug } from './date'

export interface Show {
  show_id: number
  showdate: string
  permalink: string
  artist_id: number
  artist: string
  showtitle?: string
  venue_id?: number
  venuename?: string
  location?: string
  city?: string
  state?: string
  country?: string
  tour_id?: number
  tourname?: string
  showorder: number
  show_year: number
  show_day: number
  show_dayname?: string
  show_month: number
  show_monthname?: string
}

export interface Album {
  year: number
  month: number
  day: number
  name: string
  type?: string
  note?: string
  url?: string
}

export interface Birthday {
  year: number | null
  month: number
  day: number
  who: string
}

export interface MiscEvent {
  year: number
  month: number
  day: number
  what: string
}

export interface ShowNote {
  year: number
  month: number
  day: number
  note: string
  url?: string
}

export const shows = rawShows as Show[]
export const albums = rawAlbums as Album[]
export const birthdays = (rawBirthdays as Birthday[]).filter((b) => b.who && b.month > 0 && b.day > 0)
export const miscEvents = (rawMisc as MiscEvent[]).filter((m) => m.what && m.month > 0 && m.day > 0)
export const showNotes = (rawShowNotes as ShowNote[]).filter((n) => n.note && n.month > 0 && n.day > 0)

export function showsForDay(month: number, day: number): Show[] {
  return shows.filter((s) => s.show_month === month && s.show_day === day)
}

export function albumsForDay(month: number, day: number): Album[] {
  return albums.filter((a) => a.month === month && a.day === day)
}

export function birthdaysForDay(month: number, day: number): Birthday[] {
  return birthdays.filter((b) => b.month === month && b.day === day)
}

export function miscForDay(month: number, day: number): MiscEvent[] {
  return miscEvents.filter((m) => m.month === month && m.day === day)
}

export function showNotesForDay(month: number, day: number): ShowNote[] {
  return showNotes.filter((n) => n.month === month && n.day === day)
}

/** Look up shows by full date string YYYY-MM-DD, optionally filtered by showorder */
export function showsByDate(dateStr: string, order?: number): Show[] {
  const matches = shows.filter((s) => s.showdate === dateStr)
  if (order !== undefined) return matches.filter((s) => s.showorder === order)
  return matches
}

/** All 366 calendar day slugs (uses year 2000, a leap year, so Feb 29 exists) */
export function allCalendarSlugs(): string[] {
  const slugs: string[] = []
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(2000, month + 1, 0).getDate()
    for (let day = 1; day <= daysInMonth; day++) {
      slugs.push(dateToSlug(new Date(2000, month, day)))
    }
  }
  return slugs
}

/** All unique show date strings (YYYY-MM-DD) across all shows */
export function allShowDates(): string[] {
  return [...new Set(shows.map((s) => s.showdate))]
}

/** Convert a month-day slug to { month, day }, or null if invalid */
export { slugToMonthDay as slugToData }
