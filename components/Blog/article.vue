<script lang="ts" setup>
import type BlogController from '@/utils/cms/blog/BlogController'

const { value } = defineProps<{
  value: BlogController
}>()

const { t } = useI18n()

defineOgImage({
  component: 'CmsPage',
  props: {
    description: value.getSafeTruncatedDescription(330),
    readingTime: t('time.reading_time', { time: value.getLocaleReadingTime() }),
  },
})
</script>

<template>
  <Container class="max-w-3xl">
    <div class="grid gap-1 py-12">
      <div class="text-3xl">
        {{ value.title }}
      </div>
      <div class="text-accent grid grid-flow-col justify-start gap-2">
        <span>
          <Icon name="gg:calendar" /> {{ value.getDateToLocaleString() }}
        </span>
      </div>
      <ContentRenderer :value class="max-w-full prose" />
    </div>
  </Container>
</template>
