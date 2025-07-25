<script setup lang="ts">
defineI18nRoute({
  paths: {
    'en-US': '/i-worked-in/[item]',
    'pt-BR': '/trabalhei-na/[item]',
  },
})

const route = useRoute()
const { locale } = useI18n()

const { data } = useFetch('/api/experience', {
  query: {
    lang: locale.value,
    path: 'item' in route.params ? route.params.item : '',
  },
})
</script>

<template>
  <CmsExperience v-if="data" v-bind="data" />
</template>
