#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

const SHOWS_FILE = './src/data/shows.json'
const SIDECAR_DIR = './src/data/show-links'
const OUTPUT_FILE = './src/data/show-links.json' // rebuilt separately via data:consolidateShowLinks
const BATCH_SIZE = 50 // concurrent requests per batch
// Delay between batches in ms — override via env: DELAY_MS=500 npm run data:updateShowLinks
const DELAY_MS = parseInt(process.env.DELAY_MS ?? 63 * 1000, 10) // default just over 1 minute; as of April 2026 the Songfish limit is "Max 60 requests per minute"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

fs.mkdirSync(SIDECAR_DIR, { recursive: true })

const shows = JSON.parse(fs.readFileSync(SHOWS_FILE, 'utf8'))
const showIds = [...new Set(shows.map((s) => s.show_id))]

const pending = showIds.filter((show_id) => !fs.existsSync(path.join(SIDECAR_DIR, `${show_id}.json`)))

console.log(`${showIds.length} total shows; ${showIds.length - pending.length} already fetched; ${pending.length} to fetch`)

let fetched = 0
let shouldStop = false

for (let i = 0; i < pending.length; i += BATCH_SIZE) {
  if (shouldStop) break

  const batch = pending.slice(i, i + BATCH_SIZE)
  await Promise.all(
    batch.map(async (show_id) => {
      try {
        const response = await fetch(`https://kglw.net/api/v2/links/show_id/${show_id}.json`)
        const json = await response.json()
        if (json.error) {
          console.error(`  show_id ${show_id}: API returned error:`, json)
          shouldStop = true
          return
        }
        const links = Array.isArray(json.data)
          ? json.data.map(({ url, description }) => ({ url, description }))
          : []
        // Write sidecar even when empty so the show_id is not retried on the next run
        fs.writeFileSync(path.join(SIDECAR_DIR, `${show_id}.json`), JSON.stringify(links, null, 2) + '\n')
      } catch (err) {
        console.error(`  show_id ${show_id}: ${err.message}`)
        shouldStop = true
      }
      fetched++
    })
  )
  console.log(`  fetched ${fetched}/${pending.length}`)
  if (!shouldStop && i + BATCH_SIZE < pending.length) await sleep(DELAY_MS)
}

if (shouldStop) console.log('Stopped early due to errors — re-run to resume from where it left off.')

console.log(`Done. Run 'npm run data:consolidateShowLinks' to rebuild ${OUTPUT_FILE}`)
