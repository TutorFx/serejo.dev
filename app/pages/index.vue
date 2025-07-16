<script setup lang="ts">
defineI18nRoute({
  paths: {
    'en-US': '/',
    'pt-BR': '/inicio',
  }
})
</script>

<template>
  <div>
    <Hero />
    <HomeAbroad />
    <HomeStack />
    <HomeExperiences />
  </div>
</template>
