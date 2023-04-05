import React, {useEffect, useState} from 'react'
import {Link} from 'gatsby'

import Footer from '../components/footer';
import {dateToText} from '../helpers';

export const Head = () => <title>Today in King Gizzard History</title>

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
          : <>Brought to you by <a href="http://kglw.net/?src=kglw.today&amp;campaign=credits" target="_blank">KGLW.net</a>!</>
        }
      </p>
      <Footer/>
    </main>
  )
}

export default IndexPage
