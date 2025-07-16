<script lang="ts">
import type { BlogPostsDto } from '~~/shared/utils/dto/cms.dto'

export interface BlogPostCardProps extends BlogPostsDto {}
</script>

<script setup lang="ts">
const props = defineProps<BlogPostCardProps>()
const { t } = useI18n()
</script>

<template>
  <div>
    <UICard :border="false" class="aspect-[4/2.5] group h-full" :ui="{ content: 'grid items-center', header: 'text-lg' }">
      <template #header>
        {{ title }}
      </template>
      <div>
        <div class="line-clamp-3 font-light text-balance">
          {{ props.reducedBody }}
        </div>
      </div>
      <template #footer>
        <div class="grid grid-flow-col justify-between">
          <div class="text-neutral-content grid items-center">
            {{ props.readingTimeString }}
          </div>
          <div>
            <UIButton variant="link">{{ t('see_more') }}</UIButton>
          </div>
        </div>
      </template> 
    </UICard>
  </div>
</template>