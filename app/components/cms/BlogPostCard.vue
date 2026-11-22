<script lang="ts">
export interface BlogPostCardProps {
  post: BlogPostsDto
}
</script>

<script setup lang="ts">
const props = defineProps<BlogPostCardProps>()
const { t } = useI18n()
</script>

<template>
  <div>
    <UICard
      :border="false"
      class="group aspect-4/2.5 h-full"
      :ui="{ content: 'grid items-center', header: 'text-lg' }"
    >
      <template #header>
        {{ props.post.title }}
      </template>
      <div>
        <div class="line-clamp-3 font-light text-balance">
          {{ props.post.reducedBody }}
        </div>
      </div>
      <template #footer>
        <div class="grid grid-flow-col justify-between">
          <div class="text-neutral-content grid items-center">
            {{ props.post.readingTimeString }}
          </div>
          <div>
            <UIButton variant="link">
              {{ t('see_more') }}
            </UIButton>
          </div>
        </div>
      </template>
    </UICard>
  </div>
</template>
