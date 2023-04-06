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
export default function MonthDay({data: {allShowsJson: {edges: showsOnDay}}, pageContext: {month, day}}) {
  const monthJs = month - 1;
  const dateObj = new Date(2000, monthJs, day);
  const theDay = dateToText(dateObj, {month: 'long'});

  dateObj.setDate(dateObj.getDate()-1)
  const prevDay = dateToText(dateObj)
  dateObj.setDate(dateObj.getDate()+2)
  const nextDay = dateToText(dateObj)

  return (
    <Layout className="monthday">

      <main>
        <h1>{theDay} in King Gizzard History</h1>
        {showsOnDay.length
          ? <>
            <ul className="monthday--shows">
              {showsOnDay.sort((a, b) => a.node.show_year - b.node.show_year).map(({node: show}) =>
                <li>
                  <a href={`${rootUrl}/setlists/${show.permalink}?src=kglw.today&amp;campaign=shows-on-this-day`}>
                    {show.show_year} {theDay} @ {show.venuename}, {show.city}, {show.country}
                  </a>
                </li>
              )}
            </ul>
          </>
          : <>
            <p>No known concerts on {theDay} yet!</p>
          </>
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
