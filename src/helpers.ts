export function dateToText(date: Date, opts: Intl.DateTimeFormatOptions = {}): string {
  return date.toLocaleString('en', { numberingSystem: 'latn', month: 'short', day: 'numeric', ...opts })
}

export function dateToSlug(date: Date): string {
  return dateToText(date).toLowerCase().replace(' ', '-')
}

export async function stringToSHA(message: string): Promise<string> {
  // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
  const msgUint8 = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  if ('toHex' in Uint8Array.prototype) {
    // Use toHex if supported (modern environments)
    return new Uint8Array(hashBuffer).toHex()
  }
  // Fallback for environments without Uint8Array.prototype.toHex
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
