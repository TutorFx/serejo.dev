<script setup lang="ts">
const { locale } = useI18n()
const { data: experiences } = useFetch<ExperiencesDto[]>('/api/experiences', { 
  query: {
    lang: locale.value,
    includeBody: true
  }
})
const { data: education } = useFetch<EducationDto[]>('/api/education', { 
  query: {
    lang: locale.value,
    includeBody: true
  }
})

const contact = [
  { key: 'Email', value: 'gabrieltfserejo@gmail.com' },
  { key: 'Phone', value: '+55 (62) 9 9406-3442' },
  { key: 'Website', value: 'serejo.dev' },
]
</script>

<template>
  <div>
    <CurriculumHeader title="Gabriel Serejo" :profession="$t('curriculum.profession')" :contact />
    <CurriculumBody v-if="experiences && education" :experiences :education />
    <CurriculumFooter />
  </div>
</template>