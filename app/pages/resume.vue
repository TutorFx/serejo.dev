<script lang="ts" setup>
definePageMeta({
  layout: 'none',
  colorMode: 'light',
})

const route = useRoute()

onMounted(() => {
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
  title: 'Resume',
  description: () => t('me.summary'),
  ogTitle: 'Resume',
  ogDescription: () => t('me.summary'),
})
</script>

<template>
  <Resume />
</template>
