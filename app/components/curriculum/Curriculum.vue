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

const projects: ProjectDto[] = [
  {
    title: 'Atlas Chatbot & Cockpit 2.0 Architecture',
    org: 'Implanta IT Solutions',
    delivered: [
      'Created the Atlas chatbot to unify documentation and accelerate onboarding.',
      'Created a cross-reference software using embedding models to perform semantic distinction between product names.',
      'Responsible for the Cockpit 2.0 architecture, designing a dynamic UI that enabled the backend team to build screens via API.',
    ],
  },
  {
    title: 'Customer Support Chatbot & Feature Services Migration',
    org: 'TLScontact',
    delivered: [
      'Key contributor to the development and successful launch of the company\'s customer support chatbot, actively participating in all phases of its construction.',
      'Led the architectural restructuring of the help module by migrating it from a hexagonal to a Feature Services architecture, which significantly improved the project\'s value and sustainability.',
      'Delivered critical new features, mitigated security vulnerabilities, and refactored code for institutional visa-issuing tools using technologies like Vue 2/3, Nuxt3, Node, and Spring Boot.',
    ],
  },
  {
    title: 'Retail Application Architecture (Pernambucanas)',
    org: 'Cliqx',
    delivered: [
      'Architected and led the front-end development of a major retail application for Pernambucanas, establishing a scalable hexagonal architecture with service layers.',
      'Successfully advocated for and implemented Nuxt3 as the core framework, setting the technical foundation for the project\'s success.',
      'Engineered a high-performance caching strategy using Redis and SWR, significantly reducing server workload and enhancing the application\'s overall scalability and responsiveness.',
    ],
  },
  {
    title: 'Student Admission Application',
    org: 'UniFAJ',
    delivered: [
      'Developed the end-to-end user interface for the student admission application, covering all critical stages from initial registration to the completion of exams and essays.',
      'Implemented key new features while simultaneously restructuring legacy code, applying clean code principles to enhance the application\'s maintainability and overall quality.',
    ],
  },
  {
    title: 'Web Solutions & AI Integration',
    org: 'Agência Industrial',
    delivered: [
      'Delivered complete, end-to-end web solutions for multiple clients, managing the entire project lifecycle from UI/UX design to full-stack implementation and deployment.',
      'Enhanced client projects by developing and integrating small-scale AI solutions using the GPT-3 API with Python and Node.js.',
    ],
  },
  {
    title: 'Legacy Application Refactoring & CMS Integration',
    org: 'ITH Pós Graduação',
    delivered: [
      'Led a complete refactoring of the legacy application, a project that directly improved Google Speed Insight scores and significantly reduced advertising expenses.',
      'Developed and launched a new front-end application using Nuxt2, which integrated with the company\'s WordPress CMS to modernize the user experience and content delivery.',
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
    />
    <CurriculumFooter />
  </div>
</template>
