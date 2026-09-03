<script lang="ts">
export interface CurriculumBody {
  experiences: ExperiencesDto[]
  education: EducationDto[]
  skills?: string[]
  projects?: ProjectDto[]
  certifications?: string[]
}
</script>

<script setup lang="ts">
const { t } = useI18n()
defineProps<CurriculumBody>()
</script>

<template>
  <div class="body-minimal flex flex-col bg-white text-black">
    <!-- Objective -->
    <section>
      <h2 class="section-title border-b border-black font-bold tracking-wider uppercase">
        {{ t('curriculum.objective_title') }}
      </h2>
      <p class="body-text font-medium">
        {{ t('curriculum.objective') }}
      </p>
    </section>

    <!-- Statement / Summary -->
    <section>
      <h2 class="section-title border-b border-black font-bold tracking-wider uppercase">
        {{ t('curriculum.summary') }}
      </h2>
      <p class="body-text summary-text text-justify">
        {{ t('me.summary') }}
      </p>
    </section>

    <!-- Technical Proficiencies -->
    <section v-if="skills && skills.length">
      <h2 class="section-title border-b border-black font-bold tracking-wider uppercase">
        {{ t('curriculum.technical_proficiencies') }}
      </h2>
      <div class="skills-grid flex flex-wrap gap-x-4 sm:gap-x-6 print:gap-x-4">
        <div v-for="skill in skills" :key="skill" class="flex items-center">
          <span class="mr-1.5">•</span>
          {{ skill }}
        </div>
      </div>
    </section>

    <!-- Certifications -->
    <section v-if="certifications && certifications.length">
      <h2 class="section-title border-b border-black font-bold tracking-wider uppercase">
        {{ t('curriculum.certifications_title') }}
      </h2>
      <div class="cert-list flex flex-col">
        <div v-for="cert in certifications" :key="cert" class="flex items-center">
          <span class="mr-1.5">•</span>
          {{ cert }}
        </div>
      </div>
    </section>

    <!-- Professional Experience (Compact) -->
    <section v-if="experiences && experiences.length">
      <h2 class="section-title border-b border-black font-bold tracking-wider uppercase">
        {{ t('curriculum.professional_experience') }}
      </h2>
      <div class="experience-list flex flex-col">
        <div v-for="(experience, key) in experiences" :key="key" class="flex flex-col">
          <div class="body-text flex flex-col justify-between sm:flex-row sm:items-baseline">
            <span class="font-bold uppercase">{{ experience.title }}</span>
            <span class="font-medium whitespace-nowrap text-gray-600 italic sm:text-right">
              {{ experience.start }} - {{ experience.end }}
            </span>
          </div>
          <div v-if="experience.org" class="body-text font-medium text-gray-700 italic">
            {{ experience.org }}
          </div>
        </div>
      </div>
    </section>

    <!-- Projects (Compact) -->
    <section v-if="projects && projects.length">
      <h2 class="section-title border-b border-black font-bold tracking-wider uppercase">
        {{ t('curriculum.projects_title') }}
      </h2>
      <div class="projects-list flex flex-col">
        <div v-for="(project, key) in projects" :key="key" class="flex flex-col">
          <div class="body-text flex flex-col justify-between sm:flex-row sm:items-baseline">
            <span class="font-bold">{{ project.title }}</span>
            <span v-if="project.start" class="font-medium text-gray-600 italic sm:text-right">{{ project.start }} - {{ project.end }}</span>
          </div>
          <div v-if="project.org" class="body-text font-medium text-gray-700 italic">
            {{ project.org }}
          </div>
        </div>
      </div>
    </section>

    <!-- Education -->
    <section v-if="education && education.length">
      <h2 class="section-title border-b border-black font-bold tracking-wider uppercase">
        {{ t('curriculum.education') }}
      </h2>
      <div class="education-list flex flex-col">
        <div v-for="(edu, key) in education" :key="key" class="body-text flex flex-col">
          <div class="flex flex-col justify-between sm:flex-row sm:items-baseline">
            <span class="font-bold">
              {{ edu.org }}
            </span>
            <span class="font-medium text-gray-600 italic sm:text-right">
              {{ edu.date || edu.end }}
            </span>
          </div>
          <div class="text-gray-700">
            {{ edu.title }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.body-minimal {
  padding-bottom: var(--padding-y, 1.5rem);
  padding-left: var(--padding-x, 1.5rem);
  padding-right: var(--padding-x, 1.5rem);
  gap: var(--section-gap, 1rem);
}
.section-title {
  font-size: var(--title-font-size, 0.875rem);
  margin-bottom: var(--section-title-mb, 0.5rem);
}
.body-text {
  font-size: var(--body-font-size, 0.875rem);
}
.summary-text {
  line-height: var(--summary-line-height, 1.5);
}
.skills-grid {
  font-size: var(--body-font-size, 0.875rem);
  row-gap: calc(var(--item-gap, 0.5rem) * 0.5);
}
.cert-list {
  font-size: var(--body-font-size, 0.875rem);
  gap: calc(var(--item-gap, 0.5rem) * 0.5);
}
.experience-list {
  gap: var(--item-gap, 0.5rem);
}
.projects-list {
  gap: var(--item-gap, 0.5rem);
}
.education-list {
  gap: var(--item-gap, 0.5rem);
}
</style>
