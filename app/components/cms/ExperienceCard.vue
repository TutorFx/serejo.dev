<script lang="ts">
import type { ExperiencesDto } from '~~/shared/utils/dto/cms.dto'

export type ExperienceCardProps = ExperiencesDto
</script>

<script setup lang="ts">
const props = defineProps<ExperienceCardProps>()
const { t } = useI18n()
</script>

<template>
  <div>
    <UICard :border="false" class="group h-full md:aspect-[4/2.5]" :ui="{ content: 'grid items-center' }">
      <template #header>
        <div class="grid grid-flow-col justify-between">
          <div class="line-clamp-2 text-xl xl:text-3xl">
            {{ props.org }}
          </div>
          <div class="text-neutral-content grid grid-flow-col items-center justify-start gap-3">
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
