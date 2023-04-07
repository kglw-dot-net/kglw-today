import React from 'react'
import {graphql} from 'gatsby'

import Layout from '../components/layout';
import {dateToText} from '../helpers';

import './month-day.scss'

const rootUrl = 'https://kglw.songfishapp.com'

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
  } = data;

  const monthJs = month - 1;
  const dateObj = new Date(2000, monthJs, day);
  const theDayShort = dateToText(dateObj);
  const theDayLong = dateToText(dateObj, {month: 'long'});

  dateObj.setDate(dateObj.getDate()-1)
  const prevDay = dateToText(dateObj)
  dateObj.setDate(dateObj.getDate()+2)
  const nextDay = dateToText(dateObj)

  const concertsMapping = showsOnDay
    .map(({node: show}) => {
      return {
        year: show.show_year,
        className: 'concert',
        content: <a href={`${rootUrl}/setlists/${show.permalink}?src=kglw.today&campaign=${show.show_year}-${month}-${day}`}>{show.show_year} {theDayShort} @ {show.venuename}, {show.city}, {show.country}</a>
    }})
  // global.console.log({birthdaysOnDay})
  const albumsMapping = albumsOnDay
    .map(({node: {year, name, type, note, url, ...rest}}) => {
      // if (rest[0]) global.console.log('rest of entry...', ...rest)
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
          } released {note ? <span className="layout-monthday--entry--note" title={note}>📝</span> : false}
        </>
      }
    })

  const entriesSorted = [...concertsMapping, ...albumsMapping]
    .sort((a,b) => a.year - b.year)

  return (
    <Layout className="layout-monthday">

      <main>
        <h1>{theDayLong} in King Gizzard History</h1>
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
