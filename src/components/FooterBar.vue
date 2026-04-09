<script setup lang="ts">
// The SVG is imported as a raw string so it can be inlined via v-html,
// preserving the ability to style its path fills with CSS.
import codeIconSvg from '@/assets/icon-source-code.svg?raw'
</script>

<template>
  <footer class="sitefooter">
    <nav>
      <RouterLink to="/">Back to Calendar</RouterLink>
    </nav>

    <p>
      Brought to you by
      <a href="http://kglw.net/?src=kglw.today&campaign=credits" target="_blank" rel="noreferrer">KGLW.net</a>!
    </p>

    <p>
      <a
        class="sitefooter__source"
        href="https://github.com/kglw-dot-net/kglw-today"
        title="source code on GitHub"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span class="sitefooter__icon" aria-hidden="true" v-html="codeIconSvg" />
        code is open source
      </a>
    </p>
  </footer>
</template>

<style scoped>
footer.sitefooter {
  margin: 3rem 1rem;
  text-align: center;

  nav {
    margin: 3rem 0;
  }

  p {
    margin: 2rem 0;
  }
}

.sitefooter__source {
  text-decoration: none;
  color: khaki !important;
}

.sitefooter__icon :deep(svg) {
  margin-right: 0.2rem;
  height: 2rem;
  vertical-align: middle;

  path {
    fill: khaki !important;
  }
}
</style>
