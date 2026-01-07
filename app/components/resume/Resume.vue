<script setup lang="ts">
import CurriculumHeaderMinimal from '../curriculum/CurriculumHeaderMinimal.vue'
import CurriculumFooter from '../curriculum/CurriculumFooter.vue'
import ResumeBodyMinimal from './ResumeBodyMinimal.vue'

const { locale } = useI18n()

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

// Reduced skills list for One Page Resume
const skills = [
  'Generative AI',
  'RAG',
  'LLMs',
  'LangChain',
  'TypeScript',
  'Python',
  'PyTorch',
  'Prompt Engineering',
  'Vector Databases',
  'NLP',
  'Hugging Face',
  'Model APIs (OpenAI, Gemini, Anthropic)',
  'Self-hosted Models (Ollama, Hugging Face)',
  'Cloud Platforms (Azure, AWS, GCP)',
  'TensorFlow',
  'Deep Learning',
  'Spacy',
  'Pandas',
  'OpenCV',
  'R',
  'C++',
]

const certifications = [
  'Oracle AI Vector Search Certified Professional (2025)',
]
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
