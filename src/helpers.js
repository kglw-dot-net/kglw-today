export function dateToText(date, opts={}) {
  return date.toLocaleString('en', {numberingSystem:'latn',month:'short',day:'numeric',...opts})
}
