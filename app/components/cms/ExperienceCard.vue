<script lang="ts">
import type { ExperiencesDto } from '~~/shared/utils/dto/cms.dto'

export interface ExperienceCardProps extends ExperiencesDto {}
</script>

<script setup lang="ts">
const props = defineProps<ExperienceCardProps>()
const { t } = useI18n()
</script>

<template>
  <div>
    <UICard :border="false" class="md:aspect-[4/2.5] group h-full" :ui="{ content: 'grid items-center' }">
      <template #header>
        <div class="grid grid-flow-col justify-between">
          <div class="text-xl xl:text-3xl line-clamp-2">
            {{ props.org }}
          </div>
          <div class="grid grid-flow-col justify-start gap-3 items-center text-neutral-content">
            <Icon name="line-md:calendar" />
            <div class="grid">
              <div class="text-sm">
                <div>
                  {{ props.start }}
                </div>
                <div>
                  {{ props.end }}
                </div>
              </div>
            </div>
          </div>
        </div>
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
            <UIButton variant="link">
              {{ t('see_more') }}
            </UIButton>
          </div>
        </div>
      </template>
    </UICard>
  </div>
</template>
