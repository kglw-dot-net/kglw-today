export function dateToText(date: Date, opts: Intl.DateTimeFormatOptions = {}): string {
  return date.toLocaleString('en', { numberingSystem: 'latn', month: 'short', day: 'numeric', ...opts })
}

export function dateToSlug(date: Date): string {
  return dateToText(date).toLowerCase().replace(' ', '-')
}

export async function stringToSHA(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message)
  const hashBuffer = await crypto?.subtle?.digest?.('SHA-256', msgUint8)
  // toHex() was added to Uint8Array in newer runtimes; cast to make it optional so
  // TypeScript doesn't reject the call while still allowing the fast path at runtime.
  const typedArray = new Uint8Array(hashBuffer) as Uint8Array & { toHex?: () => string }
  if (typedArray.toHex) {
    return typedArray.toHex()
  }
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Parse a slug like "jan-1" into { month: 1, day: 1 } (1-indexed) */
export function slugToMonthDay(slug: string): { month: number; day: number } | null {
  const monthNames: Record<string, number> = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
  }
  const parts = slug.split('-')
  const abbr = parts[0]
  const dayStr = parts[1]
  if (!abbr || !dayStr) return null
  const month = monthNames[abbr]
  const day = parseInt(dayStr, 10)
  if (!month || isNaN(day)) return null
  return { month, day }
}

/** Build prev/next slugs for day navigation */
export function adjacentSlugs(slug: string): { prev: string; next: string } {
  const md = slugToMonthDay(slug)
  if (!md) return { prev: slug, next: slug }
  // Use year 2000 (leap year) as reference so Feb 29 exists
  const date = new Date(2000, md.month - 1, md.day)
  const prev = new Date(date)
  prev.setDate(prev.getDate() - 1)
  const next = new Date(date)
  next.setDate(next.getDate() + 1)
  return { prev: dateToSlug(prev), next: dateToSlug(next) }
}
