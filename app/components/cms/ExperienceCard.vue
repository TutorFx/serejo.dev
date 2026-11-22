<script lang="ts">
export interface ExperienceCardProps {
  experience: ExperiencesDto
}
</script>

<script setup lang="ts">
const props = defineProps<ExperienceCardProps>()
const { t } = useI18n()
</script>

<template>
  <div>
    <UICard
      :border="false"
      class="group h-full md:aspect-[4/2.5]"
      :ui="{ content: 'grid items-center' }"
    >
      <template #header>
        <div class="grid grid-flow-col justify-between">
          <div class="line-clamp-2 text-xl xl:text-3xl">
            {{ props.experience.org }}
          </div>
          <div class="grid grid-flow-col items-center justify-start gap-3 text-neutral-content">
            <Icon name="line-md:calendar" />
            <div class="grid">
              <div class="text-sm">
                <div>
                  {{ props.experience.start }}
                </div>
                <div>
                  {{ props.experience.end }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div>
        <div class="line-clamp-3 font-light text-balance">
          {{ props.experience.reducedBody }}
        </div>
      </div>
      <template #footer>
        <div class="grid grid-flow-col justify-between">
          <div class="grid items-center text-neutral-content">
            {{ props.experience.readingTimeString }}
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
