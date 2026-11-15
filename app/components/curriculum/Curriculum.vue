<script setup lang="ts">
const { locale, t, tm, rt } = useI18n()

const { data: experiences } = await useFetch<ExperiencesDto[]>('/api/experiences', {
  query: () => ({
    lang: locale.value,
    includeBody: true,
  }),
})
const { data: education } = await useFetch<EducationDto[]>('/api/education', {
  query: () => ({
    lang: locale.value,
    includeBody: true,
  }),
})

const contact = [
  { key: 'Email', value: 'gabrielserejo11@gmail.com' },
  { key: 'Phone', value: '+55 (62) 99406-3442' },
  { key: 'Website', value: 'serejo.dev' },
  { key: 'LinkedIn', value: 'linkedin.com/in/gabrielserejo' },
  { key: 'GitHub', value: 'github.com/tutorfx' },
]

// rt compiles plain strings too, so the literal interpolations in the texts of the CV (such as {'@'}) come out as text
const skills = computed<SkillGroupDto[]>(() => {
  const groups = tm('curriculum.skills') as unknown as Array<Record<'title' | 'items', unknown>>
  return Array.isArray(groups)
    ? groups.map(group => ({ title: rt(group.title as never), items: rt(group.items as never) }))
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
    <CurriculumHeaderMinimal
      title="Gabriel Serejo"
      :profession="t('curriculum.profession')"
      :contact
    />
    <CurriculumBodyMinimal
      v-if="experiences && education"
      :experiences="experiences"
      :education="education"
      :skills="skills"
      :certifications="certifications"
    />
    <CurriculumFooter />
  </div>
</template>
