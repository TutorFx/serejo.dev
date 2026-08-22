<script setup lang="ts">
import CurriculumHeaderMinimal from '../curriculum/CurriculumHeaderMinimal.vue'
import ResumeBodyMinimal from './ResumeBodyMinimal.vue'

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
</script>

<template>
  <div class="resume-wrapper flex min-h-screen flex-col items-center justify-start bg-slate-100/70 py-0 sm:py-6 dark:bg-zinc-950 print:bg-white print:py-0">
    <div class="resume-page w-full max-w-[21cm] bg-white text-black sm:rounded-sm sm:shadow-lg print:rounded-none print:shadow-none">
      <CurriculumHeaderMinimal title="Gabriel Serejo" :contact />
      <ResumeBodyMinimal
        v-if="experiences && education"
        :experiences="experiences"
        :education="education"
        :skills="skills"
        :certifications="certifications"
      />
    </div>
  </div>
</template>

<style>
/* CSS Variables for Dynamic Vertical & Screen Sizing */
.resume-page {
  /* Default balanced spacing (fits A4 and screens beautifully) */
  --section-gap: 0.95rem;
  --section-title-mb: 0.35rem;
  --item-gap: 0.35rem;
  --padding-y: 1.5rem;
  --padding-x: 2.25rem;
  --body-font-size: 0.85rem; /* ~13.6px */
  --title-font-size: 0.925rem;
  --header-name-size: 2.25rem;
  --summary-line-height: 1.5;
}

/* Medium height viewports (>= 750px) */
@media (min-height: 750px) and (min-width: 640px) {
  .resume-page {
    --section-gap: 1.15rem;
    --section-title-mb: 0.45rem;
    --item-gap: 0.45rem;
    --padding-y: 1.85rem;
    --padding-x: 2.5rem;
    --body-font-size: 0.875rem;
    --title-font-size: 0.975rem;
    --header-name-size: 2.35rem;
    --summary-line-height: 1.55;
  }
}

/* Tall displays / Full HD / Standard monitors (>= 950px) */
@media (min-height: 950px) and (min-width: 640px) {
  .resume-page {
    --section-gap: 1.45rem;
    --section-title-mb: 0.55rem;
    --item-gap: 0.55rem;
    --padding-y: 2.35rem;
    --padding-x: 2.75rem;
    --body-font-size: 0.925rem;
    --title-font-size: 1.05rem;
    --header-name-size: 2.65rem;
    --summary-line-height: 1.6;
  }
}

/* Very tall displays / 4K viewports (>= 1150px) */
@media (min-height: 1150px) and (min-width: 640px) {
  .resume-page {
    --section-gap: 1.85rem;
    --section-title-mb: 0.65rem;
    --item-gap: 0.7rem;
    --padding-y: 3rem;
    --padding-x: 3rem;
    --body-font-size: 0.975rem;
    --title-font-size: 1.15rem;
    --header-name-size: 3rem;
    --summary-line-height: 1.7;
  }
}

@page {
  size: A4 portrait;
  margin: 0;
}

@media print {
  html, body {
    margin: 0;
    padding: 0;
    background-color: white;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .resume-wrapper {
    padding: 0;
    background: white;
    min-height: auto;
    display: block;
  }

  .resume-page {
    --section-gap: 0.85rem;
    --section-title-mb: 0.3rem;
    --item-gap: 0.3rem;
    --padding-y: 1.25rem;
    --padding-x: 2rem;
    --body-font-size: 0.825rem; /* ~13.2px */
    --title-font-size: 0.875rem;
    --header-name-size: 2rem;
    --summary-line-height: 1.45;
    box-shadow: none;
    border-radius: 0;
    margin: 0 auto;
    width: 100%;
    max-width: 21cm;
  }
}
</style>
