import React, {useEffect, useState} from 'react'
import {Link} from 'gatsby'

import Layout from '../components/layout';
import {dateToSlug, dateToText} from '../helpers';

export const Head = () => <>
  <title>Today in King Gizzard History</title>
</>

const IndexPage = () => {
  const [todayDate, setDate] = useState(null);
  useEffect(() => {
    setDate(new Date());
  }, [])

  return <Layout style={{width:'100%'}}>
      <h1>Today in King Gizzard History</h1>
      <p>
        {todayDate
          ? <>Today is <Link to={`/${dateToSlug(todayDate)}`}>{dateToText(todayDate)}</Link>...</>
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
            const date = new Date(2000, indexMonth, 1); // n.b. despite `date` being a `const`, its value will be modified during runtime...
            const monthName = dateToText(date, {month:'long'}).split(' ')[0]
            return <li style={{flexBasis:'4em',flexGrow:0,border:'1px solid gray',padding:0,minWidth:'3em'}}>
              <h2 style={{maxWidth:'100%',background:'gray',color:'white',margin:0,fontSize:'1em',textAlign:'center'}}>{monthName}</h2>
              <ul style={{margin:0,padding:0,listStyle:'none',textAlign:'center'}}>
                {Array(31).fill().map((_, indexDay) => {
                  date.setDate(indexDay+1);
                  if (date.getMonth() === indexMonth) {
                    const isToday = todayDate && date.getMonth() === todayDate.getMonth() && date.getDate() === todayDate.getDate();
                    return <li>
                      <a href={`/${dateToSlug(date)}`} style={{display:'inline-block',height:'2em',lineHeight:'2em',...(isToday ? {boxShadow:'#004488dd 1px 1px 7px 3px',borderRadius:'0.9em',width:'85%;'} : {})}}>
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
