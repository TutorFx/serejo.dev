<script setup lang="ts">
const { t } = useI18n()

defineI18nRoute({
  paths: {
    'en-US': '/projects',
    'pt-BR': '/projetos',
  },
})

useHead({
  title: t('meta.projects.title'),
  meta: [
    { name: 'description', content: t('meta.projects.description') },
    { name: 'keywords', content: t('meta.projects.keywords') },
  ],
})
</script>

<template>
  <div>
    a
  </div>
</template>
