<script setup lang="ts">
defineI18nRoute({
  paths: {
    'en-US': '/post/[item]',
    'pt-BR': '/post/[item]',
  },
})

const route = useRoute()

const localePath = useLocalePath()
const setI18nParams = useSetI18nParams()
const { locale } = useI18n()

const { data } = await useFetch('/api/post', {
  query: {
    lang: locale.value,
    path: 'item' in route.params ? route.params.item : '',
  },
})

if (data.value) {
  const { alternates, slug, path } = data.value

  // Lets switchLocalePath (language switcher) use the slug of each locale
  setI18nParams(Object.fromEntries(
    Object.entries(alternates).map(([alternateLocale, item]) => [alternateLocale, { item }]),
  ))

  if (data.value.locale !== locale.value) {
    const alternate = alternates[locale.value]
    const redirectPath = alternate
      ? localePath({ name: 'post-item', params: { item: alternate } })
      : localePath({ name: 'post-item', params: { item: slug || path } }, data.value.locale)

    await navigateTo(redirectPath, { redirectCode: 301, replace: true })
  }
}

useHead({
  title: data.value?.title,
  meta: [
    { name: 'description', content: data.value?.reducedBody?.substring(0, 300) },
  ],
})

defineOgImage('CmsThumbnail.takumi', {
  title: data.value?.title,
  description: data.value ? `${data.value.reducedBody?.substring(0, 362)}...` : '',
  readingTime: data.value ? data.value.readingTimeString : '',
})
</script>

<template>
  <CmsBlogPost v-if="data" v-bind="{ ...data, createdAt: new Date(data.createdAt) }" />
</template>
