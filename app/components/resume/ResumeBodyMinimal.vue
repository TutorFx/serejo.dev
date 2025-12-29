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
  <div class="flex flex-col gap-3 px-4 py-4 bg-white text-black max-w-[21cm] mx-auto">
    <!-- Statement / Summary -->
    <section class="mb-2">
      <p class="text-sm text-justify leading-relaxed">
        {{ $t('me.summary') }}
      </p>
    </section>

    <!-- Technical Proficiencies -->
    <section v-if="skills && skills.length">
      <h2 class="text-sm font-bold uppercase border-b border-black mb-1">
        Technical Proficiencies
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
      <h2 class="text-sm font-bold uppercase border-b border-black mb-1">
        Certifications
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
      <h2 class="text-sm font-bold uppercase border-b border-black mb-2">
        Professional Experience
      </h2>
      <div class="flex flex-col gap-1.5">
        <div v-for="(experience, key) in experiences" :key="key" class="flex flex-col">
          <div class="flex justify-between items-baseline">
            <h3 class="font-bold text-sm uppercase">
              {{ experience.title }}
            </h3>
            <span class="text-xs italic font-medium whitespace-nowrap">
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
      <h2 class="text-sm font-bold uppercase border-b border-black mb-2">
        Projects
      </h2>
      <div class="flex flex-col gap-1.5">
        <div v-for="(project, key) in projects" :key="key" class="flex flex-col">
          <div class="flex justify-between items-baseline">
            <div class="flex gap-2 items-baseline">
              <h3 class="font-bold text-base">
                {{ project.title }}
              </h3>
              <span class="text-sm italic text-gray-700">– {{ project.org }}</span>
            </div>
          </div>
          <!-- No deliverables list -->
        </div>
      </div>
    </section>

    <!-- Education -->
    <section v-if="education && education.length">
      <h2 class="text-sm font-bold uppercase border-b border-black mb-2">
        Education
      </h2>
      <div class="flex flex-col gap-2">
        <div v-for="(edu, key) in education" :key="key" class="flex flex-col">
          <div class="flex justify-between items-baseline">
            <h3 class="font-bold text-sm">
              {{ edu.org }}
            </h3>
            <span class="text-sm font-bold text-right">
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
