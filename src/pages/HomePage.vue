<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { dateToSlug, dateToText } from '@/utils/date'

// Today's date is determined client-side on mount so every visitor sees their
// actual current day regardless of when the static build was run.
const todayDate = ref<Date | null>(null)
onMounted(() => {
  todayDate.value = new Date()
})

// Build the full calendar: 12 months × days-in-that-month (using year 2000
// as the reference so Feb 29 appears for leap year completeness).
interface CalendarMonth {
  name: string
  days: Array<{ slug: string; label: string }>
}

function buildCalendar(): CalendarMonth[] {
  return Array.from({ length: 12 }, (_, monthIndex) => {
    const firstOfMonth = new Date(2000, monthIndex, 1)
    const monthName = dateToText(firstOfMonth, { month: 'long' }).split(' ')[0]
    const daysInMonth = new Date(2000, monthIndex + 1, 0).getDate()

    const days = Array.from({ length: daysInMonth }, (__, dayIndex) => {
      const dayDate = new Date(2000, monthIndex, dayIndex + 1)
      return {
        slug: dateToSlug(dayDate),
        label: dateToText(dayDate),
      }
    })

    return { name: monthName, days }
  })
}

const calendar = buildCalendar()

function isToday(slug: string): boolean {
  if (!todayDate.value) return false
  const todaySlug = dateToSlug(todayDate.value)
  return slug === todaySlug
}
</script>

<template>
  <head>
    <title>Today in King Gizzard History</title>
  </head>

  <article class="layout-index">
    <h1>Today in King Gizzard History</h1>

    <p v-if="todayDate">
      Today is
      <RouterLink :to="`/${dateToSlug(todayDate)}`">{{ dateToText(todayDate) }}</RouterLink>
    </p>
    <p v-else>
      Loading…
      <noscript><strong>This site requires JavaScript.</strong></noscript>
    </p>

    <div class="calendar">
      <h2>Calendar</h2>
      <p>Pick a different day?</p>
      <ul>
        <li v-for="month in calendar" :key="month.name">
          <h3>{{ month.name }}</h3>
          <ul>
            <li v-for="day in month.days" :key="day.slug">
              <RouterLink :to="`/${day.slug}`" :class="{ today: isToday(day.slug) }">
                {{ day.label }}
              </RouterLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
.layout-index {
  width: 100%;
  text-align: center;

  > p {
    font-size: 1.5em;
  }
}

.calendar {
  h2 {
    display: none;
  }

  a {
    padding: 5px;
  }

  > ul {
    padding: 0;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    list-style: none;

    > li {
      flex-basis: 3em;
      flex-grow: 1;
      border: 0.3px solid var(--color-paleblue);
      padding: 0;
    }
  }

  h3 {
    margin: 0;
    padding: 0.2em 0.5em;
    background: var(--color-paleblue);
    color: black;
    font-size: 0.7em;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  li > ul {
    margin: 0;
    padding: 0;
    list-style: none;
    text-align: center;

    li a {
      display: inline-block;
      height: 2em;
      margin: 0 0.1em;
      padding: 0 0.1em;
      line-height: 2em;
      white-space: nowrap;

      &:hover:not(.today) {
        text-shadow: #70969f66 1px 2px 5px;
      }

      &.today {
        box-shadow: #70969fdd 1px 1px 7px 3px;
        border-radius: 0.9em;
      }
    }
  }
}
</style>
