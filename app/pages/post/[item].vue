<script setup lang="ts">
defineI18nRoute({
  paths: {
    'en-US': '/post/[item]',
    'pt-BR': '/post/[item]',
  },
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const localePath = useLocalePath()
const { locale } = useI18n()

const { data } = await useFetch('/api/post', {
  query: {
    lang: locale.value,
    path: 'item' in route.params ? route.params.item : '',
  },
})

useHead({
  title: data.value?.title,
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

watch(data, (newValue) => {
  if (!newValue)
    return
  if (newValue.locale === locale.value)
    return

  router.push(localePath({ name: 'post-item', params: { item: newValue.path } }))
}, { immediate: true })
</script>

<template>
  <CmsBlogPost v-if="data" v-bind="data" />
</template>
