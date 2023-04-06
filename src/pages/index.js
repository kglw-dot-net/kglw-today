import React, {useEffect, useState} from 'react'
import {Link} from 'gatsby'

import Footer from '../components/footer';
import {dateToText} from '../helpers';

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
      <noscript><strong>This site requires JavaScript.</strong></noscript>
      <h1>Today in King Gizzard History</h1>
      <p>
        {day
          ? <>Today is <Link to={`/${day.toLowerCase().replace(' ','-')}`}>{day}</Link>...</>
          : <>Loading...</>
        }
      </p>
      <Footer/>
    </main>
  )
}

export default IndexPage
