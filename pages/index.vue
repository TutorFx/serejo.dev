<script setup lang="ts">
const { t } = useI18n()

useHead({
  titleTemplate: '%siteName',
  meta: [
    { name: 'description', content: t('meta.home.description') },
    { name: 'keywords', content: t('meta.home.keywords') },
  ],
})

defineOgImage({
  component: 'default',
})
</script>

<template>
  <div class="grid grid-cols-1">
    <Hero />
    <MeAbroad />
    <MeStack />
    <HistorySelector />
  </div>
</template>
