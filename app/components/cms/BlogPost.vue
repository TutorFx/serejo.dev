<script lang="ts">
import type { BlogPostDto } from '~~/shared/utils/dto/cms.dto'

export interface BlogPostProps extends BlogPostDto {}
</script>

<script setup lang="ts">
const props = defineProps<BlogPostProps>()
</script>

<template>
  <div class="grid grid-rows-[max-content_1fr] gap-6">
    <UIContainer class="grid">
      <UIHeroCms :title="props.title" :back-to="{ name: 'blog' }">
        <div class="p-4 grid grid-flow-col justify-start items-center gap-3 font-light">
          <Icon class="text-accent" size="24" name="material-symbols:alarm-outline-rounded" /> {{ props.readingTimeString }}
        </div>
      </UIHeroCms>
    </UIContainer>
    <div class="gap-4 grid grid-rows-[max-content_1fr]">
      <UIContainer class="grid items-start gap-3 [&_>_div]:grid [&_>_div]:gap-3">
        <ContentRenderer :value="props.body" />
      </UIContainer>
    </div>
  </div>
</template>