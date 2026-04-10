// Analytics: only fires in production builds and not on localhost.
// Rendered server-side via Astro — no client hydration needed.
export default function GoatCounter() {
  const isProduction = import.meta.env.PROD

  if (!isProduction) return null

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.goatcounter = {
              path: function() {
                return '/@today' + location.pathname + location.search + location.hash
              }
            };
          `,
        }}
      />
      <script
        data-goatcounter="https://kglw.goatcounter.com/count"
        async
        src="//gc.zgo.at/count.js"
      />
    </>
  )
}
