import React, {useEffect, useState} from 'react'
import {Link} from 'gatsby'

import Layout from '../components/layout';
import {dateToSlug, dateToText} from '../helpers';

import './index.scss'

export const Head = () => <>
  <title>Today in King Gizzard History</title>
</>

const IndexPage = () => {
  const [todayDate, setDate] = useState(null);
  useEffect(() => {
    setDate(new Date());
  }, [])

  return <Layout className="layout-index">
      <h1>Today in King Gizzard History</h1>
      <p>
        {todayDate
          ? <>Today is <Link to={`/${dateToSlug(todayDate)}`}>{dateToText(todayDate)}</Link></>
          : <>Loading...
           <noscript><strong>This site requires JavaScript.</strong></noscript>
          </>
        }
      </p>
      <div className="calendar">
        <h2>Calendar</h2>
        <p>Pick a different day?</p>
        <ul style={{}}>
          {Array(12).fill().map((_, indexMonth) => {
            const date = new Date(2000, indexMonth, 1); // n.b. despite `date` being a `const`, its value will be modified during runtime...
            const monthName = dateToText(date, {month:'long'}).split(' ')[0];
            return <li>
              <h3>{monthName}</h3>
              <ul>
                {Array(31).fill().map((_, indexDay) => {
                  date.setDate(indexDay+1);
                  if (date.getMonth() === indexMonth) {
                    const isToday = todayDate && date.getMonth() === todayDate.getMonth() && date.getDate() === todayDate.getDate();
                    return <li>
                      <a href={`/${dateToSlug(date)}`} className={isToday ? 'today' : ''}>
                        {dateToText(date)}
                      </a>
                    </li>
                  }
                  return false
                })}
              </ul>
            </li>
          })}
        </ul>
      </div>
    </Layout>
}

export default IndexPage
