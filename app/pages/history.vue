<script setup lang="ts">
const { t } = useI18n()

defineI18nRoute({
  paths: {
    'en-US': '/my-trajectory',
    'pt-BR': '/minha-jornada',
  },
})

useHead({
  title: t('meta.history.title'),
  meta: [
    { name: 'description', content: t('meta.history.description') },
    { name: 'keywords', content: t('meta.history.keywords') },
  ],
})
</script>

<template>
  <div class="grid items-center bg-base-200">
    <UIContainer>
      <CmsExperienceCardList />
    </UIContainer>
  </div>
</template>
