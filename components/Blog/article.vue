<script lang="ts" setup>
import type BlogController from '@/utils/cms/blog/BlogController'

defineProps<{
  value: BlogController
}>()
</script>

<template>
  <Container class="max-w-3xl">
    <div class="grid py-12 gap-1">
      <div class="text-3xl">
        {{ value.title }}
      </div>
      <div class="grid grid-flow-col justify-start gap-2 text-accent">
        <span>
          <Icon name="gg:calendar" /> {{ value.getDateToLocaleString() }}
        </span>
      </div>
      <ContentRenderer :value class="prose max-w-full" />
    </div>
  </Container>
</template>
