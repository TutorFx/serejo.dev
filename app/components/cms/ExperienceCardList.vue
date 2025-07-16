<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()

const { data: experiences } = useFetch('/api/experiences', {
  query: {
    lang: locale.value
  }
})
</script>

<template>
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 py-12">
    <NuxtLink v-if="experiences" v-for="(experience, key) in experiences" :key :to="localePath({ name:'experience-item', params: { item: experience.path } })" >
      <CmsExperienceCard v-bind="experience" />
    </NuxtLink>
  </div>
</template>