import {__, filter} from 'ramda'

// n.b. all this data uses human-style month numbers (Jan=1), not JS-style (Jan=0)
import albumsData from './albums.json'
import birthdaysData from './birthdays.json'
import miscData from './misc.json'
import showNotesData from './show-notes.json'
import showsData from './shows.json'

function findWithin(dataSet) {
  const finder = filter(__, dataSet)
  return ({monthNum, day}) => finder((entry) => entry.month === monthNum && entry.day === day)
}

export const findAlbums = findWithin(albumsData)
export const findBirthdays = findWithin(birthdaysData)
export const findMisc = findWithin(miscData)
export const findShowNotes = findWithin(showNotesData)

const showFinder = filter(__, showsData)
export const findShows = ({monthNum, day}) => {
  return showFinder((entry) => entry.show_month === monthNum && entry.show_day === day)
}
