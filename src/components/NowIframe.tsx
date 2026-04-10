'use client'

import { useEffect, useState } from 'react'
import { dateToSlug } from '../utils/date'

// Client-side React island: determines today's slug after mount so the
// iframe always reflects the visitor's local timezone.
export default function NowIframe() {
  const [iframeSrc, setIframeSrc] = useState<string | undefined>(undefined)

  useEffect(() => {
    setIframeSrc(`/${dateToSlug(new Date())}?ui=sparse`)
  }, [])

  return (
    <>
      {!iframeSrc && (
        <noscript>This requires JavaScript to determine what day it is for you.</noscript>
      )}
      {iframeSrc && (
        <iframe
          src={iframeSrc}
          title="Right Now in King Gizzard History"
          className="now-iframe"
        />
      )}
    </>
  )
}
