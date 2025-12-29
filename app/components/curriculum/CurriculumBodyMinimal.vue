<script lang="ts">
import Qrcode from 'qrcode.vue'

export interface CurriculumBody {
  experiences: ExperiencesDto[]
  education: EducationDto[]
  skills?: string[]
  projects?: ProjectDto[]
  certifications?: string[] // Simple string array for now as minimal view
}
</script>

<script setup lang="ts">
defineProps<CurriculumBody>()
</script>

<template>
  <div class="flex flex-col gap-6 px-4 py-6 bg-white text-black max-w-[21cm] mx-auto">
    <!-- Statement / Summary -->
    <section class="mb-2">
      <p class="text-sm text-justify leading-relaxed">
        {{ $t('me.summary') }}
      </p>
    </section>

    <!-- Technical Proficiencies -->
    <section v-if="skills && skills.length">
      <h2 class="text-lg font-bold uppercase border-b-2 border-black mb-2">
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
    <section v-if="certifications && certifications.length" class="mt-4">
      <h2 class="text-lg font-bold uppercase border-b-2 border-black mb-2">
        Certifications
      </h2>
      <div class="flex flex-col gap-1 text-sm">
        <div v-for="cert in certifications" :key="cert" class="flex items-center">
          <span class="mr-2">•</span>
          {{ cert }}
        </div>
      </div>
    </section>

    <!-- Professional Experience -->
    <section v-if="experiences && experiences.length">
      <h2 class="text-lg font-bold uppercase border-b-2 border-black mb-3">
        Professional Experience
      </h2>
      <div class="flex flex-col gap-4">
        <div v-for="(experience, key) in experiences" :key="key" class="flex flex-col">
          <div class="flex justify-between items-baseline">
            <h3 class="font-bold text-base uppercase">
              {{ experience.title }}
            </h3>
            <span class="text-sm italic font-medium whitespace-nowrap">
              {{ experience.start }} - {{ experience.end }}
            </span>
          </div>
          <!-- Optional: Organization if needed, though image focuses on Role -->
          <div v-if="experience.org" class="text-sm font-semibold italic mb-1">
            {{ experience.org }}
          </div>

          <ul v-if="experience.delivered" class="list-disc list-outside ml-4 text-sm space-y-0.5">
            <li v-for="(item, index) in experience.delivered" :key="index" class="pl-1">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Projects -->
    <section v-if="projects && projects.length">
      <h2 class="text-lg font-bold uppercase border-b-2 border-black mb-3">
        Projects
      </h2>
      <div class="flex flex-col gap-4">
        <div v-for="(project, key) in projects" :key="key" class="flex flex-col">
          <div class="flex justify-between items-baseline border-b border-gray-200 pb-0.5 mb-1">
            <div class="flex gap-2 items-baseline">
              <h3 class="font-bold text-base">
                {{ project.title }}
              </h3>
              <span class="text-sm italic text-gray-700">– {{ project.org }}</span>
            </div>
            <!-- Date for projects if available, otherwise hide -->
            <span v-if="project.start" class="text-sm italic font-medium whitespace-nowrap">
              {{ project.start }} - {{ project.end }}
            </span>
          </div>

          <p v-if="project.reducedBody" class="text-sm mb-1">
            {{ project.reducedBody }}
          </p>

          <ul v-if="project.delivered" class="list-disc list-outside ml-4 text-sm space-y-0.5">
            <li v-for="(item, index) in project.delivered" :key="index" class="pl-1">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Education -->
    <section v-if="education && education.length">
      <h2 class="text-lg font-bold uppercase border-b-2 border-black mb-3">
        Education
      </h2>
      <div class="flex flex-col gap-2">
        <div v-for="(edu, key) in education" :key="key" class="flex flex-col">
          <div class="flex justify-between items-baseline">
            <h3 class="font-bold text-base">
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
