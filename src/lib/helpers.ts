export function dateToText(date:Date, opts:Record<string,any>={}):string {
  return date.toLocaleString('en', {
    numberingSystem: 'latn',
    month: 'short',
    day: 'numeric',
    ...opts,
  })
}

export function dateToSlug(date:Date):string {
  return dateToText(date).toLowerCase().replace(' ', '-')
}

/* export function zeroPad(n:number):string {
  if (n > 99)
    throw new Error(`zeroPad not intended to be used on numbers this big: ${n}`)
  return n < 10
    ? `0${n}`
    : n.toString()
} */
