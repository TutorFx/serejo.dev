<script lang="ts">
export interface ExperienceProps {
  experience: ExperienceDto
}
</script>

<script setup lang="ts">
const props = defineProps<ExperienceProps>()
</script>

<template>
  <div class="grid grid-rows-[max-content_1fr] gap-6">
    <UIContainer class="grid">
      <UIHeroCms :title="props.experience.org" :back-to="{ name: 'history' }">
        <div class="grid grid-flow-col items-center justify-start gap-3 p-4 font-light">
          <Icon class="text-accent" size="24" name="line-md:calendar" />
          <div>{{ props.experience.start }}</div>
          —
          <div>{{ props.experience.end }}</div>
        </div>
      </UIHeroCms>
    </UIContainer>
    <div class="grid grid-rows-[max-content_1fr] gap-4">
      <UIContainer class="grid items-start gap-3 [&_>_div]:grid [&_>_div]:gap-3">
        <ContentRenderer :value="props.experience.body" />
      </UIContainer>
    </div>
  </div>
</template>
