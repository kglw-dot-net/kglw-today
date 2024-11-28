<script lang="ts">
  import {dateToText, dateToSlug} from '$lib/helpers'

  const months = Array(12).fill(null).map((_, i) => i)               // January is 0, not 1...
  const daysInLongestMonth = Array(31).fill(null).map((_, i) => i+1) // ...but days start at 1

  const leapYear = 2000

  function monthName(month:number) {
    const firstOfThaMonth = new Date(leapYear, month, 1) // yes this is a Bone Thugs reference
    return dateToText(firstOfThaMonth, {month:'long'}).split(' ')[0]
  }
</script>


<p class="my-2">Pick a different day?</p>

<div class="flex flex-row flex-wrap justify-center mb-10">
  {@render halfMonth(months.slice(0, 6))}
  {@render halfMonth(months.slice(6))}
</div>

{#snippet halfMonth(months:number[])}
  <ul class="flex flex-row flex-wrap justify-center">
    {#each months as month}
      <li class="grow p-0">
        <h3 class="m-0 px-1 py-1 text-xs text-zinc-900 bg-blue-gothic text-center text-ellipsis overflow-hidden">
          {monthName(month)}
        </h3>
        <ul>
          {#each daysInLongestMonth as day}
            {@const date = new Date(leapYear, month, day)}
            {#if date.getMonth() === month}
              {@const url = `/${dateToSlug(date)}`}
              <li class="my-1 text-center whitespace-nowrap">
                <a href={url} class="px-2 py-1 text-green-mantis visited:text-blue-gothic">
                  {dateToText(date)}
                </a>
              </li>
            {/if}
          {/each}
        </ul>
      </li>
    {/each}
  </ul>
{/snippet}


<style lang="postcss">
  ul > li {
    min-width: 8.2vw;
    max-width: min(16.5vw, 6em);
  }
</style>
