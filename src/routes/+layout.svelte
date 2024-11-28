<script lang="ts">
  import '../app.css'
  import githubLogo from '$lib/assets/logo-github-white.svg'
  let {children} = $props()
</script>


<main>
  {@render children()}
</main>

<footer class="mb-10 text-center text-sm">
  <p class="my-4">with ❤  from <a href="https://kglw.net?src=kglw.today&campaign=footer" title="KGLW.net is the premier King Gizzard fan site" target="_blank" rel="noopener noreferrer">KGLW.net</a></p>
  <p class="my-4">code is
    <a href="https://github.com/kglw-dot-net/kglw-today" title="code for this site on GitHub" target="_blank" rel="noopener noreferrer">
      open-source
      <img src={githubLogo} alt="GitHub logo" />
    </a>
  </p>
</footer>

<style lang="postcss">
  :global(html) {
    color: theme(colors.zinc.200);
    background-color: theme(colors.zinc.900);
  }
  :global(a) {
    color: yellowgreen;
  }
  :global(a:hover) {
    text-shadow: 1px 2px 5px hsl(from yellow h s l / .6)
  }

  footer img {
    width: 1.25em;
    aspect-ratio: 1;
    display: inline;
    vertical-align: text-bottom;
  }
</style>
