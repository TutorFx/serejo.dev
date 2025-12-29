<script lang="ts" setup>
definePageMeta({
  layout: 'none',
  colorMode: 'light',
})

const route = useRoute()

onMounted(()=> {
  if ('print' in route.query) {
    nextTick(() => {
      setTimeout(() => {
        window.print()
      }, 100)
    })
  }
})

const { t } = useI18n()

useSeoMeta({
  title: 'Curriculum Vitae',
  description: () => t('me.summary'),
  ogTitle: 'Curriculum Vitae',
  ogDescription: () => t('me.summary'),
})
</script>

<template>
  <Curriculum />
</template>
