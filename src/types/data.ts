export type Show = {
  show_id: number
  showdate: string  // YYYY-MM-DD
  permalink: string
  artist_id: number
  artist: string
  showtitle?: string
  venue_id: number
  venuename: string
  location: string
  city: string
  state?: string
  country: string
  tour_id: number
  tourname: string
  showorder: number
  show_year: number
  show_day: number
  show_dayname: string
  show_month: number
  show_monthname: string
}

export type Album = {
  year: number
  month: number
  day: number
  name: string
  type?: string
  note?: string
  url?: string
}

export type Birthday = {
  year: number
  month: number
  day: number
  who: string
}

export type Misc = {
  year: number
  month: number
  day: number
  what: string
}

export type ShowNote = {
  year: number
  month: number
  day: number
  note: string
}
