<script setup lang="ts">
const { locale } = useI18n()

const { data: experiences } = await useFetch<ExperiencesDto[]>('/api/experiences', {
  query: {
    lang: locale.value,
    includeBody: true,
  },
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

const projects: ProjectDto[] = [
  {
    title: 'Atlas Chatbot & Cockpit 2.0 (RAG & Semantic Search)',
    org: 'Implanta IT Solutions',
    delivered: [
      'I engineered "Atlas", a production-grade RAG chatbot using LangChain, Vercel AI SDK, and pg-vector that unified documentation and accelerated onboarding.',
      'I developed a semantic cross-reference system using embedding models for automated product normalization via NLP.',
      'I architected "Cockpit 2.0", designing a dynamic UI-from-API engine using advanced TypeScript that decoupled frontend from feature launches.',
    ],
  },
  {
    title: 'Customer Support Chatbot & Scalable Micro-Frontend Migration',
    org: 'TLScontact',
    delivered: [
      'I was the lead developer for the official customer support chatbot, managing end-to-end integration of conversational AI flows.',
      'I championed the migration to a "Feature Services" architecture, establishing the scalability required for real-time AI toolsets.',
      'I oversaw security and feature delivery for institutional visa tools using Vue 3 and Node.js.',
    ],
  },
  {
    title: 'Retail Application Architecture (High-Concurrency Patterns)',
    org: 'Cliqx',
    delivered: [
      'I managed cloud infrastructure on Azure, provisioning and configuring server instances to support high-concurrency retail applications.',
      'I scaled the front-end architecture for a major retail application (Pernambucanas) using a service-oriented hexagonal pattern.',
      'I engineered a high-performance Redis/SWR caching layer, providing the low-latency foundation necessary for AI-driven data apps.',
      'I migrated legacy workflows to Nuxt 3, improving system throughput and team development velocity.',
    ],
  },
  {
    title: 'Student Admission Application',
    org: 'UniFAJ',
    delivered: [
      'I developed the end-to-end user interface for the student admission application, covering all critical stages from initial registration to the completion of exams and essays.',
      'I implemented key new features while simultaneously restructuring legacy code, applying clean code principles to enhance the application\'s maintainability and overall quality.',
    ],
  },
  {
    title: 'Web Solutions & AI Integration',
    org: 'Agência Industrial',
    delivered: [
      'I delivered complete, end-to-end web solutions for multiple clients, managing the entire project lifecycle from UI/UX design to full-stack implementation and deployment.',
      'I enhanced client projects by developing and integrating small-scale AI solutions using the GPT-3 API with Python and Node.js.',
    ],
  },
  {
    title: 'Legacy Application Refactoring & CMS Integration',
    org: 'ITH Pós Graduação',
    delivered: [
      'I led a complete refactoring of the legacy application, a project that directly improved Google Speed Insight scores and significantly reduced advertising expenses.',
      'I developed and launched a new front-end application using Nuxt2, which integrated with the company\'s WordPress CMS to modernize the user experience and content delivery.',
    ],
  },
]
</script>

<template>
  <div>
    <CurriculumHeaderMinimal title="Gabriel Serejo" :profession="$t('curriculum.profession')" :contact />
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
