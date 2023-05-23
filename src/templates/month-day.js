import React from 'react'
import {graphql} from 'gatsby'

import Layout from '../components/layout';
import {dateToText} from '../helpers';

import './month-day.scss'

const rootUrl = 'https://kglw.net'

export const Head = ({pageContext:{month,day}}) => {
  const monthJs = month - 1;
  const dateObj = new Date(2000, monthJs, day);
  return <>
    <title>{dateToText(dateObj)} in King Gizzard History</title>
  </>
}

// Note: the month value represents Jan=1 Dec=12 to match the data
export default function MonthDay({data, pageContext: {month, day}}) {
  const {
    allAlbumsJson: {edges: albumsOnDay},
    allBirthdaysJson: {edges: birthdaysOnDay},
    allShowsJson: {edges: showsOnDay},
    allShowNotesJson: {edges: notesOnShows},
  } = data;

  const monthJs = month - 1;
  const dateObj = new Date(2000, monthJs, day);
  const theDayShort = dateToText(dateObj);
  const theDayLong = dateToText(dateObj, {month: 'long'});

  dateObj.setDate(dateObj.getDate()-1)
  const prevDay = dateToText(dateObj)
  dateObj.setDate(dateObj.getDate()+2)
  const nextDay = dateToText(dateObj)

  global.console.log({notesOnShows})
  const notesByYear = notesOnShows.reduce((acc, {node: {year, note}}) => {
    if (!acc[year]) acc[year] = []
    acc[year].push(note)
    return acc
  }, {})
  global.console.log({notesByYear})

  const concertsMapping = showsOnDay
    .map(({node: {show_year, permalink, venuename, city, country}}) => {
      const notes = notesByYear[show_year]?.join("; ")
      return {
        year: show_year,
        className: 'concert',
        content: <>
          <a href={`${rootUrl}/setlists/${permalink}?src=kglw.today&campaign=${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`}>{show_year} {theDayShort} @ {venuename}, {city}, {country}</a>
          {notes && <span className="layout-monthday--entry--note" title={notes}>📝</span>}
        </>
    }})
  const albumsMapping = albumsOnDay
    .map(({node: {year, name, type, note, url, ...rest}}) => {
      const entry = <><cite>{name}</cite>{type ? ` ${type}` : false}</>
      return {
        year,
        className: 'release',
        content: <>
          {year} {theDayShort}:
          &nbsp;
          {url
            ? <a href={url} target="_blank" rel="noreferrer">{entry}</a>
            : entry
          } released {note && <span className="layout-monthday--entry--note" title={note}>📝</span>}
        </>
      }
    })

  const entriesSorted = [...concertsMapping, ...albumsMapping]
    .sort((a,b) => a.year - b.year)

  return (
    <Layout className="layout-monthday">

      <main>
        <h1>{theDayLong} <br/> in <br/> King Gizzard <br/> History</h1>
        {birthdaysOnDay.map(({node: {year, who}}) => <em className="layout-monthday--birthday">Happy Birthday to {who}!!</em>)}
        {entriesSorted.length
          ? <ul>{entriesSorted.map(entry => <li key={`${entry.year}-${entry.className}`} className={`${entry.className} layout-monthday--entry`}>{entry.content}</li>)}</ul>
          : <p className="layout-monthday--empty">On {theDayShort}, the band rests.</p>
        }
      </main>

      <nav style={{}}>
        <a className="nav-prev" href={`/${prevDay.toLowerCase().replace(' ', '-')}`}>{prevDay}</a>
        <a className="nav-next" href={`/${nextDay.toLowerCase().replace(' ', '-')}`}>{nextDay}</a>
      </nav>

    </Layout>
  )
}

export const query = graphql`
  query MonthDayQuery($day: Int, $month: Int) {
    allAlbumsJson(filter: {day: {eq: $day}, month: {eq: $month}}) {
      edges {
        node {
          year
          name
          type
          note
          url
        }
      }
    }
    allBirthdaysJson(filter: {day: {eq: $day}, month: {eq: $month}}) {
      edges {
        node {
          year
          who
        }
      }
    }
    allShowNotesJson(filter: {day: {eq: $day}, month: {eq: $month}}) {
      edges {
        node {
          year
          note
        }
      }
    }
    allShowsJson(filter: {show_day: {eq: $day}, show_month: {eq: $month}}) {
      edges {
        node {
          permalink
          tourname
          show_year
          venuename
          city
          state
          country
        }
      }
    }
  }
`
