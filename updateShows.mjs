#!/usr/bin/env node

import fs from 'fs';

console.log('updating shows...');

const filename = './src/data/shows.json';

const fetchCall = await fetch('https://kglw.net/api/v2/shows.json');
const {data} = await fetchCall.json();
const formatted = data.map(showData => {
  const {
    created_at,
    updated_at,
    ...rest
  } = showData
  return rest
})
console.log(`...saving data from ${formatted.length} shows`)
const content = JSON.stringify(formatted, null, 2);

fs.writeFileSync(filename, content + '\n');

console.log('success!');
