<script setup lang="ts">
import CurriculumHeaderMinimal from '../curriculum/CurriculumHeaderMinimal.vue'
import CurriculumFooter from '../curriculum/CurriculumFooter.vue'
import ResumeBodyMinimal from './ResumeBodyMinimal.vue'

const { locale, tm, rt } = useI18n()

const { data: experiences } = await useFetch<ExperiencesDto[]>('/api/experiences', {
  query: {
    lang: locale.value,
    includeBody: true,
  },
  // Show all experiences, minimal view
})

const { data: education } = await useFetch<EducationDto[]>('/api/education', {
  query: {
    lang: locale.value,
    includeBody: true,
  },
})

const contact = [
  { key: 'Email', value: 'gabrieltfserejo@gmail.com' },
  { key: 'Phone', value: '+55 (62) 9 9406-3442' },
  { key: 'Website', value: 'serejo.dev' },
]

const skills = computed<string[]>(() => {
  const items = tm('curriculum.skills') as unknown as unknown[]
  return Array.isArray(items)
    ? items.map((item: unknown) => (typeof item === 'string' ? item : rt(item as never)))
    : []
})

const certifications = computed<string[]>(() => {
  const items = tm('curriculum.certifications') as unknown as unknown[]
  return Array.isArray(items)
    ? items.map((item: unknown) => (typeof item === 'string' ? item : rt(item as never)))
    : []
})
</script>

<template>
  <div>
    <CurriculumHeaderMinimal title="Gabriel Serejo" :profession="$t('curriculum.profession')" :contact />
    <ResumeBodyMinimal
      v-if="experiences && education"
      :experiences="experiences"
      :education="education"
      :skills="skills"
      :certifications="certifications"
    />
    <CurriculumFooter />
  </div>
</template>
