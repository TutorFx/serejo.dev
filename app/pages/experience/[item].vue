<script setup lang="ts">
defineI18nRoute({
  paths: {
    'en-US': '/i-worked-in/[item]',
    'pt-BR': '/trabalhei-na/[item]',
  },
})

const route = useRoute()
const { locale } = useI18n()

const { data } = await useFetch('/api/experience', {
  query: {
    lang: locale.value,
    path: 'item' in route.params ? route.params.item : '',
  },
})

useHead({
  title: data.value?.org + ' — ' + data.value?.title,
  meta: [
    { name: 'description', content: data.value?.reducedBody?.substring(0, 300) },
  ],
})

defineOgImage({
  component: 'CmsThumbnail',
  props: {
    description: data.value ? data.value.reducedBody?.substring(0, 362) + '...' : '',
    readingTime: data.value ? data.value.readingTimeString : '',
  },
})
</script>

<template>
  <CmsExperience v-if="data" v-bind="data" />
</template>
