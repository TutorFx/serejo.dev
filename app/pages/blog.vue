<script setup lang="ts">
const { t } = useI18n()

defineI18nRoute({
  paths: {
    'en-US': '/blog',
    'pt-BR': '/blog',
  },
})

useHead({
  title: t('meta.blog.title'),
  meta: [
    { name: 'description', content: t('meta.blog.description') },
    { name: 'keywords', content: t('meta.blog.keywords') },
  ],
})
</script>

<template>
  <div class="grid items-center bg-base-200">
    <UIContainer>
      <CmsBlogCardList />
    </UIContainer>
  </div>
</template>
