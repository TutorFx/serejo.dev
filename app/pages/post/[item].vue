<script setup lang="ts">
defineI18nRoute({
  paths: {
    'en-US': '/post/[item]',
    'pt-BR': '/post/[item]',
  },
})

const route = useRoute()
const router = useRouter()

const localePath = useLocalePath()
const { locale } = useI18n()

const { data } = useFetch('/api/post', {
  query: {
    lang: locale.value,
    path: 'item' in route.params ? route.params.item : '',
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
