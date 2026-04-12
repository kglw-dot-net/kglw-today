#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

const SIDECAR_DIR = './src/data/show-links'
const OUTPUT_FILE = './src/data/show-links.json'

const files = fs.readdirSync(SIDECAR_DIR).filter((f) => f.endsWith('.json'))

const consolidated = {}
for (const file of files) {
  const show_id = path.basename(file, '.json')
  const links = JSON.parse(fs.readFileSync(path.join(SIDECAR_DIR, file), 'utf8'))
  if (links.length > 0) consolidated[show_id] = links
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(consolidated, null, 2) + '\n')
console.log(`Consolidated ${files.length} sidecar files → ${Object.keys(consolidated).length} shows with links → ${OUTPUT_FILE}`)
