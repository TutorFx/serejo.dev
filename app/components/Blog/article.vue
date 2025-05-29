<script lang="ts" setup>
import type BlogController from '~/app/utils/cms/blog/BlogController'

const { value } = defineProps<{
  value: BlogController
}>()

const { t } = useI18n()

/* defineOgImage({
  component: 'CmsPage',
  props: {
    description: value.getSafeTruncatedDescription(330),
    readingTime: t('time.reading_time', { time: value.getLocaleReadingTime() }),
  },
}) */
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
