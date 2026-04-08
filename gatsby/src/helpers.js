export function dateToText(date, opts={}) {
  return date.toLocaleString('en', {numberingSystem:'latn',month:'short',day:'numeric',...opts})
}

export function dateToSlug(date) {
  return dateToText(date).toLowerCase().replace(' ', '-')
}

export async function stringToSHA(message) {
  // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
  const msgUint8 = new TextEncoder().encode(message) // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto?.subtle?.digest?.("SHA-256", msgUint8) // hash the message
  if (Uint8Array.prototype.toHex) {
    // Use toHex if supported.
    return new Uint8Array(hashBuffer).toHex() // Convert ArrayBuffer to hex string.
  }
  // If toHex() is not supported, fall back to an alternative implementation.
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("") // convert bytes to hex string
  return hashHex
}

