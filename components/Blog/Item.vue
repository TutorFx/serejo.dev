<script lang="ts" setup>
import type BlogController from '@/utils/cms/blog/BlogController'

defineProps<{
  value: BlogController
}>()
</script>

<template>
  <div>
    <div class="group grid cursor-pointer py-2">
      <div class="group-hover:decoration-primary text-2xl group-hover:underline group-hover:decoration-wavy">
        {{ value.title }}
      </div>
      <div class="text-accent grid grid-flow-col justify-start gap-2">
        <span>
          <Icon name="gg:alarm" /> {{ $t('time.reading_time', { time: value.getLocaleReadingTime() }) }}
        </span>
        <span>
          <Icon name="gg:calendar" /> {{ value.getDateToLocaleString(useLocale()) }}
        </span>
      </div>
      <div class="line-clamp-2 mb-3">
        {{ value.getTruncatedDescription(150) }}
      </div>
      <div>
        {{ $t('see_more') }}
      </div>
    </div>
  </div>
</template>
