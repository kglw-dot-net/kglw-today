<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown'
  import {__, filter} from 'ramda'
  import {dateToSlug, dateToText} from '$lib/helpers'
  import {
    findAlbums,
    findBirthdays,
    findMisc,
    findShows,
    findShowNotes,
  } from '../../data/findByDate'

  type Entry = {year:number, month:number, day:number} & Record<string,any>

  let {data} = $props()

  let {month, monthNumJS, day} = $derived(data)
  const prevDate = $derived(new Date(new Date(2000, monthNumJS, day).setDate(day - 1)))
  const nextDate = $derived(new Date(new Date(2000, monthNumJS, day).setDate(day + 1)))

  const monthNum = $derived(monthNumJS + 1)

  const birthdays = $derived.by(() => findBirthdays({monthNum, day}))

  const albums = $derived.by(() => findAlbums({monthNum, day}).map((entry:Entry) => {
    entry.entrytype = 'album'
    return entry
  }))
  const showNotes = $derived.by(() => findShowNotes({monthNum, day}).map((entry:Entry) => {
    entry.entrytype = 'shownote'
    return entry
  }))
  const shows = $derived.by(() => findShows({monthNum, day}).map((entry:Entry) => {
    entry.year = entry.show_year
    entry.entrytype = 'show'
    entry.note = filter((note:Entry) => note.year === entry.show_year, showNotes)?.[0]?.note
    return entry
  }))
  const misc = $derived.by(() => findMisc({monthNum, day}).map((entry:Entry) => {
    entry.entrytype = 'misc'
    return entry
  }))

  const entries = $derived.by(() => [...albums, ...misc, ...shows].toSorted((a, b) => {
    if (a.year === b.year) {
      return a.showorder - b.showorder
    }
    return a.year - b.year
  }))
</script>


<nav class="flex flex-row flex-wrap justify-around w-full my-4">
  <a class="py-2 px-3 rounded-lg text-black bg-blue-gothic" href={`/${dateToSlug(prevDate)}`} title={`${dateToText(prevDate)} in King Gizzard History`}>
    {dateToText(prevDate)}
  </a>
  <a class="py-2 px-3 rounded-lg text-black bg-blue-gothic" href={`/${dateToSlug(nextDate)}`} title={`${dateToText(nextDate)} in King Gizzard History`}>
    {dateToText(nextDate)}
  </a>
</nav>

<h1 class="mt-4 text-3xl text-blue-gothic font-silkscreen">{month} {day} in King Gizzard History</h1>

<div class="birthdays my-4">
  {#each birthdays as birthday}
    <p class="my-3">Happy Birthday {birthday.who}!!</p>
  {/each}
</div>

{#if entries.length}
  <ul class="entries max-w-3xl">
    {#each entries as entry, index}
      <li class="my-2">
        {entry.year}:

        {#if entry.entrytype === 'show'}

          {@const {venuename, showorder, city, country, permalink, note} = entry}
          <a href={`https://kglw.net/setlists/${permalink}?src=kglw.today&campaign=${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`} target="_blank" rel="noopener">
            concert @ {venuename}{showorder === 1 || entries[index - 1].venuename !== venuename ? `, ${city}, ${country}` : ` [show ${showorder}]`}
          </a>
          {#if note}
            <span title={note} class="hover:cursor-pointer">📝</span>
          {/if}

        {:else if entry.entrytype === 'album'}

          {@const {name, type, note, url} = entry}
          release of
          {#if url}
            <a href={url} target="_blank" rel="noopener"><cite>{name}</cite>{type ? ` ${type}` : ''}</a>
          {:else}
            <cite>{name}</cite>{type ? ` ${type}` : ''}
          {/if}
          {#if note}
            <span title={note} class="hover:cursor-pointer">📝</span>
          {/if}

        {:else if entry.entrytype === 'misc'}

          <SvelteMarkdown source={entry.what} />

        {/if}
      </li>
    {/each}
  </ul>
{:else}
  <p>On {month} {day}, the band rests.</p>
{/if}


<style lang="postcss">
  nav a:hover {
    box-shadow: -1px -1px 5px hsl(from yellow h s l / .6) inset;
  }

  :global(.entries li p) { /* SvelteMarkdown wraps in a <p> tag... need to wrap in `global` because Tailwind/PostCSS doesn't see the <p> tag so it won't add it to the dynamic class */
    display: inline;
  }
</style>
