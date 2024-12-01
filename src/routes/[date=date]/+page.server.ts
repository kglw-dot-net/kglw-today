const MONTH_MAPPING = { // month abbreviation mapped to: full name and number-of-days-in-month
  'jan': {i:  0, name: 'January',   daysInMonth: 31},
  'feb': {i:  1, name: 'February',  daysInMonth: 29}, // leap year
  'mar': {i:  2, name: 'March',     daysInMonth: 31},
  'apr': {i:  3, name: 'April',     daysInMonth: 30},
  'may': {i:  4, name: 'May',       daysInMonth: 31},
  'jun': {i:  5, name: 'June' ,     daysInMonth: 30},
  'jul': {i:  6, name: 'July',      daysInMonth: 31},
  'aug': {i:  7, name: 'August',    daysInMonth: 31},
  'sep': {i:  8, name: 'September', daysInMonth: 30},
  'oct': {i:  9, name: 'October',   daysInMonth: 31},
  'nov': {i: 10, name: 'November',  daysInMonth: 30},
  'dec': {i: 11, name: 'December',  daysInMonth: 31},
}

export function load({params}) {
  console.log('server-side load', {params})
  const {date} = params
  const [monthAbbr, dayStr] = date.split('-')
  if (!(monthAbbr in MONTH_MAPPING))
    throw new Error(`ruh roh dunno what date that is: ${month} ${day}`)
  const {i, name, daysInMonth} = MONTH_MAPPING[monthAbbr]
  const day = Number(dayStr)
  if (day > daysInMonth)
    throw new Error(`ruh roh day number too big: ${month} ${day}`)
  return {
    month: name,
    monthNumJS: i,
    day,
    // dateSlug: date,
  }
}
