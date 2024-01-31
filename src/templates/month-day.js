import React, {useEffect, useState} from 'react';
import {graphql} from 'gatsby'
import MarkdownIt from 'markdown-it'

import Layout from '../components/layout';
import {dateToText} from '../helpers';

import './month-day.scss'

const md = MarkdownIt()

export const Head = ({pageContext:{month,day}}) => {
  const dateObj = new Date(2000, month - 1, day); // note — JavaScript's Date object treats 0 = January, 11 = November...
  return <>
    <title>{dateToText(dateObj)} in King Gizzard History</title>
  </>
}

// Note: the month value represents Jan=1 Dec=12 to match the source data
export default function MonthDay({data, pageContext: {month, day}}) {
  const {
    allAlbumsJson: {edges: albumsOnDay},
    allBirthdaysJson: {edges: birthdaysOnDay},
    allShowsJson: {edges: showsOnDay},
    allMiscJson: {edges: miscOnDay},
    allShowNotesJson: {edges: notesOnShows},
  } = data;

  const [isSparseLayout, setSparseLayout] = useState(false);
  useEffect(() => {
    setSparseLayout(global?.location?.search === '?ui=sparse') // TODO this is not very robust
  }, []);

  const dateObj = new Date(2000, month - 1, day); // note — JavaScript's Date object treats 0 = January, 11 = November...
  const theDayShort = dateToText(dateObj);
  const theDayLong = dateToText(dateObj, {month: 'long'});

  dateObj.setDate(dateObj.getDate()-1)
  const prevDay = dateToText(dateObj)
  dateObj.setDate(dateObj.getDate()+2)
  const nextDay = dateToText(dateObj)

  const notesByYear = notesOnShows.reduce((acc, {node: {year, note}}) => {
    if (!acc[year]) acc[year] = []
    acc[year].push(note)
    return acc
  }, {})

  const concertsMapping = showsOnDay
    .map(({node: {show_year, permalink, venuename, city, country}}) => {
      const notes = notesByYear[show_year]?.join("; ")
      return {
        year: show_year,
        className: 'concert',
        content: <>
          <a href={`https://kglw.net/setlists/${permalink}?src=kglw.today&campaign=${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`} target="_blank" rel="noopener">{show_year} {theDayShort} @ {venuename}, {city}, {country}</a>
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
            ? <a href={url} target="_blank" rel="noopener">{entry}</a>
            : entry
          } released {note && <span className="layout-monthday--entry--note" title={note}>📝</span>}
        </>
      }
    })
  const miscMapping = miscOnDay.map(({node: {year, what}}) => {
    return {
      year,
      className: 'misc',
      content: <>
        {year} {theDayShort}:
        &nbsp;
        <span dangerouslySetInnerHTML={{__html:md.renderInline(what)}} />
      </>
    }
  })

  const entriesSorted = [...concertsMapping, ...albumsMapping, ...miscMapping]
    .sort((a,b) => a.year - b.year)

  return (
    <Layout className={`layout-monthday ${isSparseLayout ? 'layout-monthday-sparse' : ''}`}>

      <main>
        <h1>{theDayLong} <br/> in <br/> King Gizzard <br/> History</h1>
        {birthdaysOnDay.map(({node: {year, who}}) => <em className="layout-monthday--birthday">Happy Birthday to {who}!!</em>)}
        {entriesSorted.length
          ? <ul>{entriesSorted.map(entry => <li key={`${entry.year}-${entry.className}`} className={`${entry.className} layout-monthday--entry`}>{entry.content}</li>)}</ul>
          : <p className="layout-monthday--empty">On {theDayShort}, the band rests.</p>
        }
      </main>

      <nav>
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
    allMiscJson(filter: {day: {eq: $day}, month: {eq: $month}}) {
      edges {
        node {
          year
          what
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
