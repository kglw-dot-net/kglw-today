import React, { useEffect, useState } from 'react'
import { dateToSlug, dateToText } from '../helpers'

export default function Calendar() {
  const [todayDate, setDate] = useState<Date | null>(null)
  useEffect(() => {
    // Intentional: defer to client to avoid SSR hydration mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDate(new Date())
  }, [])
  return (
    <div className="calendar">
      <ul>
        {Array(12).fill(null).map((_, indexMonth) => {
          const date = new Date(2000, indexMonth, 1)
          const monthName = dateToText(date, { month: 'long' }).split(' ')[0]
          return <li key={indexMonth}>
            <h3>{monthName}</h3>
            <ul>
              {Array(31).fill(null).map((_, indexDay) => {
                date.setDate(indexDay + 1)
                if (date.getMonth() === indexMonth) {
                  const isToday = todayDate && date.getMonth() === todayDate.getMonth() && date.getDate() === todayDate.getDate()
                  return <li key={indexDay}>
                    <a href={`/${dateToSlug(date)}`} className={isToday ? 'today' : ''}>
                      {dateToText(date)}
                    </a>
                  </li>
                }
                return null
              })}
            </ul>
          </li>
        })}
      </ul>
    </div>
  )
}
