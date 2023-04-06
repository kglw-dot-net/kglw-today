import React, {useEffect, useState} from 'react'
import {Link} from 'gatsby'

import Footer from '../components/footer';
import {dateToSlug, dateToText} from '../helpers';

export const Head = () => <>
  <title>Today in King Gizzard History</title>
  <script>{`
    window.goatcounter = {
      path: function() {
        return '/@today' + location.pathname + location.search + location.hash
      }
    };
  `}</script>
</>

const IndexPage = () => {
  const [day, setDay] = useState(null);
  useEffect(() => {
    setDay(dateToText(new Date()));
  }, [])
  return (
    <main>
      
      <h1>Today in King Gizzard History</h1>
      <p>
        {day
          ? <>Today is <Link to={`/${day.toLowerCase().replace(' ','-')}`}>{day}</Link>...</>
          : <>Loading...
           <noscript><strong>This site requires JavaScript.</strong></noscript>
          </>
        }
      </p>
      <div className="calendar">
        <h2 style={{display:'none'}}>Calendar</h2>
        <p>Pick a different day?</p>
        <ul style={{padding:0,display:'flex',flexFlow:'row wrap',justifyContent:'center',listStyle:'none'}}>
          {Array(12).fill().map((_, indexMonth) => {
            const date = new Date(2000, indexMonth, 1);
            const monthName = dateToText(date, {month:'long'}).split(' ')[0]
            return <li style={{flexBasis:'4em',flexGrow:0,border:'1px solid gray',padding:0,minWidth:'3em'}}>
              <h2 style={{maxWidth:'100%',background:'gray',color:'white',margin:0,fontSize:'1em',textAlign:'center'}}>{monthName}</h2>
              <ul style={{margin:'0.1em',padding:0,listStyle:'none',textAlign:'center'}}>
                {Array(31).fill().map((_, indexDay) => {
                  date.setDate(indexDay+1);
                  global.console.log(date)
                  if (date.getMonth() === indexMonth) {
                    return <li><a href={`/${dateToSlug(date)}`} style={{}}>{dateToText(date)}</a></li>
                  }
                  return false
                })}
              </ul>
            </li>
          })}
        </ul>
      </div>
      <Footer/>
    </main>
  )
}

export default IndexPage
