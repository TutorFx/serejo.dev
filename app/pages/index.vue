<script setup lang="ts">
const { t } = useI18n()

defineI18nRoute({
  paths: {
    'en-US': '/',
    'pt-BR': '/inicio',
  },
})

useHead({
  title: t('meta.home.title'),
  meta: [
    { name: 'description', content: t('meta.home.description') },
    { name: 'keywords', content: t('meta.home.keywords') },
  ],
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
