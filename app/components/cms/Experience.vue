<script lang="ts">
import type { ExperienceDto } from '~~/shared/utils/dto/cms.dto'

export interface ExperienceProps extends ExperienceDto {}
</script>

<script setup lang="ts">
const props = defineProps<ExperienceProps>()
</script>

<template>
  <div class="grid grid-rows-[max-content_1fr] gap-6">
    <UIContainer class="grid">
      <UIHeroCms :title="props.org" :back-to="{ name: 'history' }">
        <div class="p-4 grid grid-flow-col justify-start items-center gap-3 font-light">
          <Icon class="text-accent" size="24" name="line-md:calendar" /> <div>{{ props.start }}</div> — <div>{{ props.end }}</div>
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
