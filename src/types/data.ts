export interface Show {
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
  year: number
  month: number
  day: number
  who: string
}

export interface Misc {
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
}
