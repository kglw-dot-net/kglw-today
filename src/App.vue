<script setup lang="ts">
import FooterBar from '@/components/FooterBar.vue'
import GoatCounter from '@/components/GoatCounter.vue'
</script>

<template>
  <GoatCounter />
  <RouterView />
  <FooterBar />
</template>
