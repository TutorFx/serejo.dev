<script lang="ts">
export interface BlogPostProps {
  post: BlogPostDto
}
</script>

<script setup lang="ts">
const props = defineProps<BlogPostProps>()
</script>

<template>
  <div class="grid grid-rows-[max-content_1fr] gap-6">
    <UIContainer class="grid">
      <UIHeroCms :title="props.post.title" :back-to="{ name: 'blog' }">
        <div class="grid grid-flow-col items-center justify-start gap-3 p-4 font-light">
          <Icon class="text-accent" size="24" name="material-symbols:alarm-outline-rounded" />
          {{ props.post.readingTimeString }}
        </div>
      </UIHeroCms>
    </UIContainer>
    <div class="grid grid-rows-[max-content_1fr] gap-4">
      <UIContainer class="grid items-start gap-3 [&_>_div]:grid [&_>_div]:gap-3">
        <ContentRenderer :value="props.post.body" />
      </UIContainer>
    </div>
  </div>
</template>
