import React from 'react'
import {graphql} from 'gatsby'

import Layout from '../components/layout';
import {dateToText} from '../helpers';

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
    <Layout style={{maxWidth:'33em',margin:'auto',display:'flex',flexFlow:'column nowrap',alignItems:'center'}}>

      <main style={{width:'100%',borderRadius:'1em',background:'#66666666',boxShadow:'1em 1em 1em 1em black'}}>
        <h1 style={{margin:'0.75em',textAlign:'center'}}>{theDay} in King Gizzard History</h1>
        {showsOnDay.length
          ? <>
            <ul style={{listStyleType:'"\\261E"',paddingLeft:'1em'}}>
              {showsOnDay.sort((a, b) => a.node.show_year - b.node.show_year).map(({node: show}) =>
                <li style={{margin:'0.5em'}}>
                  <a href={`${rootUrl}/setlists/${show.permalink}?src=kglw.today&amp;campaign=shows-on-this-day`} style={{padding:'0.5em'}}>
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

      <nav style={{width:'100%',margin:'1em',display:'flex',flexFlow:'row nowrap',justifyContent:'space-around'}}>
        <a className="nav-prev" href={`/${prevDay.toLowerCase().replace(' ', '-')}`} style={{padding:'2em'}}>{prevDay}</a>
        <a className="nav-next" href={`/${nextDay.toLowerCase().replace(' ', '-')}`} style={{padding:'2em'}}>{nextDay}</a>
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
