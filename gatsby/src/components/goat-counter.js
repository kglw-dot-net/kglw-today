import React from 'react'

const isProduction = process.env.NODE_ENV === 'production'

export default function GoatCounter() {
  if (isProduction)
    if (global && global.location && !global.location.host.startsWith('localhost')) // intentionally not using ?.
      return <>
        <script>{`
          window.goatcounter = {
            path: function() {
              return '/@today' + location.pathname + location.search + location.hash
            }
          };
        `}</script>
        <script dataGoatcounter="https://kglw.goatcounter.com/count" async src="//gc.zgo.at/count.js" />
      </>
  return false
}
