import React from 'react'
import {graphql} from 'gatsby'

import Footer from '../components/footer';
import {dateToText} from '../helpers';

const rootUrl = 'https://kglw.songfishapp.com'

export const Head = ({pageContext:{month,day}}) => {
  const monthJs = month - 1;
  const dateObj = new Date(2000, monthJs, day);
  return <>
    <title>{dateToText(dateObj)} in King Gizzard History</title>
    <script>{`
      window.goatcounter = {
        path: function() {
          return '/@today' + location.pathname + location.search + location.hash
        }
      };
    `}</script>
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
    <div style={{maxWidth:'40em',margin:'auto',display:'flex',flexFlow:'column nowrap',alignItems:'center'}}>

      <main style={{borderRadius:'1em',background:'#66666666',boxShadow:'1em 1em 1em 1em black'}}>
        <h1>{theDay} in King Gizzard History</h1>
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

      <nav style={{order:-1,width:'100%',margin:'1em',display:'flex',flexFlow:'row nowrap',justifyContent:'space-around'}}>
        <a class="nav-prev" href={`/${prevDay.toLowerCase().replace(' ', '-')}`} style={{padding:'2em'}}>{prevDay}</a>
        <a class="nav-next" href={`/${nextDay.toLowerCase().replace(' ', '-')}`} style={{padding:'2em'}}>{nextDay}</a>
      </nav>

      <Footer />
    </div>
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
