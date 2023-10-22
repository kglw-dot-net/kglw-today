#!/usr/bin/env node

import fs from 'fs';

console.log('updating shows...');

const filename = './src/data/shows.json';

const fetchCall = await fetch('https://kglw.net/api/v2/shows.json');
const responseToJSON = await fetchCall.json();
const content = JSON.stringify(responseToJSON.data, null, 2);

fs.writeFileSync(filename, content + '\n');

console.log('success!');
