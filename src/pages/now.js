import React, {useEffect, useMemo, useState} from 'react';
import GoatCounter from '../components/goat-counter';
import Footer from '../components/footer';
import {dateToSlug, dateToText} from '../helpers';

export const Head = () => <>
  <GoatCounter renderedAt={new Date().toDateString().split(' ').slice(1, 3).join(' ')} />
  <title>Right Now in King Gizzard History</title>
</>;

const dateObjToMonthDaySlug = (dateObj) => dateObj.toDateString().split(/ 0?/).slice(1, 3).join(' ')?.toLowerCase().replace(' ', '-')

const NowPage = () => {
  const [todayDate, setDate] = useState(new Date());
  useEffect(() => {
    setDate(new Date());
  }, []);
  const iframeSrc = useMemo(() => todayDate && `/${dateObjToMonthDaySlug(todayDate)}?ui=sparse`, [todayDate]);
  return <>
    <noscript>This requires JavaScript to determine what day it is for you.</noscript>
    <iframe src={iframeSrc} style={{width:'100vw',height:'100vh',border:0}} />
  </>
}

export default NowPage
