import React, { useEffect } from 'react'

const isProduction = process.env.NODE_ENV === 'production'

export default function GoatCounter() {
  useEffect(() => {
    if (!isProduction) return
    if (window.location.host.startsWith('localhost')) return

    const configScript = document.createElement('script')
    configScript.textContent = `
      window.goatcounter = {
        path: function() {
          return '/@today' + location.pathname + location.search + location.hash
        }
      };
    `
    document.head.appendChild(configScript)

    const countScript = document.createElement('script')
    countScript.setAttribute('data-goatcounter', 'https://kglw.goatcounter.com/count')
    countScript.async = true
    countScript.src = '//gc.zgo.at/count.js'
    document.head.appendChild(countScript)
  }, [])

  return null
}
