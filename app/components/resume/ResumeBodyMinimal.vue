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
defineProps<CurriculumBody>()
</script>

<template>
  <div class="mx-auto flex max-w-[21cm] flex-col gap-3 bg-white px-4 py-4 text-black">
    <!-- Statement / Summary -->
    <section class="mb-2">
      <p class="text-justify text-sm leading-relaxed">
        {{ $t('me.summary') }}
      </p>
    </section>

    <!-- Technical Proficiencies -->
    <section v-if="skills && skills.length">
      <h2 class="mb-1 border-b border-black text-sm font-bold uppercase">
        {{ $t('curriculum.technical_proficiencies') }}
      </h2>
      <div class="flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <div v-for="skill in skills" :key="skill" class="flex items-center">
          <span class="mr-2">•</span>
          {{ skill }}
        </div>
      </div>
    </section>

    <!-- Certifications -->
    <section v-if="certifications && certifications.length" class="mt-2">
      <h2 class="mb-1 border-b border-black text-sm font-bold uppercase">
        {{ $t('curriculum.certifications_title') }}
      </h2>
      <div class="flex flex-col gap-0.5 text-xs">
        <div v-for="cert in certifications" :key="cert" class="flex items-center">
          <span class="mr-2">•</span>
          {{ cert }}
        </div>
      </div>
    </section>

    <!-- Professional Experience (One-Line / Compact) -->
    <section v-if="experiences && experiences.length">
      <h2 class="mb-2 border-b border-black text-sm font-bold uppercase">
        {{ $t('curriculum.professional_experience') }}
      </h2>
      <div class="flex flex-col gap-1.5">
        <div v-for="(experience, key) in experiences" :key="key" class="flex flex-col">
          <div class="flex items-baseline justify-between">
            <h3 class="text-sm font-bold uppercase">
              {{ experience.title }}
            </h3>
            <span class="text-xs font-medium whitespace-nowrap italic">
              {{ experience.start }} - {{ experience.end }}
            </span>
          </div>
          <div v-if="experience.org" class="text-sm font-semibold italic">
            {{ experience.org }}
          </div>
          <!-- No deliverables list, purely role history -->
        </div>
      </div>
    </section>

    <!-- Projects (Compact) -->
    <section v-if="projects && projects.length">
      <h2 class="mb-2 border-b border-black text-sm font-bold uppercase">
        {{ $t('curriculum.projects_title') }}
      </h2>
      <div class="flex flex-col gap-1.5">
        <div v-for="(project, key) in projects" :key="key" class="flex flex-col">
          <div class="flex items-baseline justify-between">
            <div class="flex items-baseline gap-2">
              <h3 class="text-base font-bold">
                {{ project.title }}
              </h3>
              <span class="text-sm text-gray-700 italic">– {{ project.org }}</span>
            </div>
          </div>
          <!-- No deliverables list -->
        </div>
      </div>
    </section>

    <!-- Education -->
    <section v-if="education && education.length">
      <h2 class="mb-2 border-b border-black text-sm font-bold uppercase">
        {{ $t('curriculum.education') }}
      </h2>
      <div class="flex flex-col gap-2">
        <div v-for="(edu, key) in education" :key="key" class="flex flex-col">
          <div class="flex items-baseline justify-between">
            <h3 class="text-sm font-bold">
              {{ edu.org }}
            </h3>
            <span class="text-right text-sm font-bold">
              {{ edu.date || edu.end }}
            </span>
          </div>
          <div class="text-sm">
            {{ edu.title }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
