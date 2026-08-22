<script setup lang="ts">
const { locale, tm, rt } = useI18n()

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

const projects = computed<ProjectDto[]>(() => {
  const items = tm('curriculum.projects') as unknown as Array<Record<string, unknown>>
  if (!Array.isArray(items)) return []
  return items.map((p: Record<string, unknown>) => ({
    title: typeof p.title === 'string' ? p.title : rt(p.title as never),
    org: typeof p.org === 'string' ? p.org : rt(p.org as never),
    delivered: Array.isArray(p.delivered)
      ? p.delivered.map((d: unknown) => (typeof d === 'string' ? d : rt(d as never)))
      : [],
  }))
})
</script>

<template>
  <div>
    <CurriculumHeaderMinimal title="Gabriel Serejo" :contact />
    <CurriculumBodyMinimal
      v-if="experiences && education"
      :experiences="experiences"
      :education="education"
      :skills="skills"
      :projects="projects"
      :certifications="certifications"
    />
    <CurriculumFooter />
  </div>
</template>
