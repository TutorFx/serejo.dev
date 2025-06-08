<script setup lang="ts">
import { codeToHtml } from 'shiki'

const props = defineProps<{
  code?: string
  language?: string
}>()

const id = useId()

const { data } = useAsyncData(`shiki${id}`, async () => {
  return codeToHtml(props.code || '', {
    lang: props.language || 'text',
    theme: 'github-dark',
  })
})
</script>

<template>
  <div class="not-prose [&_div_>_pre_>_code]:grid [&_div_>_pre_>_code]:w-full [&_div_>_pre_>_code]:overflow-x-auto [&_div_>_pre]:rounded-lg [&_div_>_pre]:p-6">
    <div class="overflow-x-auto whitespace-nowrap max-w-sm sm:max-w-xl lg:max-w-5xl xl:max-w-7xl mx-auto" v-html="data" />
  </div>
</template>
