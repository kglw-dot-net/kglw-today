import React from 'react'
import {graphql, useStaticQuery} from 'gatsby'

const rootUrl = 'https://kglw.songfishapp.com'

function dateToText(date, opts={}) {
  return date.toLocaleString('en', {numberingSystem:'latn',month:'short',day:'numeric',...opts})
}

// Note: the month value represents Jan=1 Dec=12 to match the data
export default function MonthDay({data: {allShowsJson: {edges: showsOnDay}}, pageContext: {month, day}}) {
  const monthJs = month - 1;
  const dateObj = new Date(2000, monthJs, day);
  const theDay = dateToText(dateObj, {month: 'long'});

  dateObj.setDate(dateObj.getDate()-1)
  const prevDay = dateToText(dateObj)
  dateObj.setDate(dateObj.getDate()+2)
  const nextDay = dateToText(dateObj)

  return (
    <div style={{display:'flex',flexFlow:'column nowrap'}}>
      <h1>
        Today in King Gizzard History: {theDay}
      </h1>
      {showsOnDay.length
        ? <>
          <ul>
            {showsOnDay.sort((a, b) => a.node.show_year - b.node.show_year).map(({node: show}) =>
              <li>
                <a href={`${rootUrl}/setlists/${show.permalink}`}>{show.show_year}</a>
                &nbsp;@ {show.venuename}, {show.city}, {show.country}
              </li>
            )}
          </ul>
        </>
        : <>
          <p>No known concerts on {theDay} yet!</p>
        </>
      }
      <nav style={{order:-1,margin:'1em',display:'flex',flexFlow:'row nowrap',justifyContent:'space-around'}}>
        <a class="nav-prev" href={`/${prevDay.toLowerCase().replace(' ', '-')}`}>{prevDay}</a>
        <a class="nav-next" href={`/${nextDay.toLowerCase().replace(' ', '-')}`}>{nextDay}</a>
      </nav>
    </div>
  )
}

export const query = graphql`
  query MonthDayQuery($day: Int, $month: Int = 10) {
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
