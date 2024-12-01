<script lang="ts">
  import {dateToText, dateToSlug} from '$lib/helpers'
  import Calendar from '$lib/components/Calendar.svelte'

  let today:Date|null = $state(null)

  $effect(() => {
    today = new Date()
  })
</script>


<main class="flex flex-col flex-nowrap items-center p-1">

  <h1 class="my-8 text-3xl text-blue-gothic font-silkscreen">Today in King Gizzard History</h1>

  <noscript><strong>This site requires JavaScript.</strong></noscript>

  {#if today}
    <h2 class="my-6 text-2xl">Today is <a href={`/${dateToSlug(today)}`} class="text-green-mantis underline underline-offset-4">{dateToText(today)}</a></h2>
  {/if}

  <Calendar />

</main>


<style lang="postcss">
</style>
