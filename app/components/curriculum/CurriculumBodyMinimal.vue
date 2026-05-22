<script lang="ts">
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
  <div class="mx-auto flex max-w-[21cm] flex-col gap-6 bg-white px-4 py-6 text-black">
    <!-- Statement / Summary -->
    <section class="mb-2">
      <p class="text-justify text-sm leading-relaxed">
        {{ $t('me.summary') }}
      </p>
    </section>

    <!-- Technical Proficiencies -->
    <section v-if="skills && skills.length">
      <h2 class="mb-2 border-b-2 border-black text-lg font-bold uppercase">
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
      <h2 class="mb-2 border-b-2 border-black text-lg font-bold uppercase">
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
      <h2 class="mb-3 border-b-2 border-black text-lg font-bold uppercase">
        Professional Experience
      </h2>
      <div class="flex flex-col gap-4">
        <div v-for="(experience, key) in experiences" :key="key" class="flex flex-col">
          <div class="flex items-baseline justify-between">
            <h3 class="text-base font-bold uppercase">
              {{ experience.title }}
            </h3>
            <span class="text-sm font-medium whitespace-nowrap italic">
              {{ experience.start }} - {{ experience.end }}
            </span>
          </div>
          <!-- Optional: Organization if needed, though image focuses on Role -->
          <div v-if="experience.org" class="mb-1 text-sm font-semibold italic">
            {{ experience.org }}
          </div>

          <ul v-if="experience.delivered" class="ml-4 list-outside list-disc space-y-0.5 text-sm">
            <li v-for="(item, index) in experience.delivered" :key="index" class="pl-1">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Projects -->
    <section v-if="projects && projects.length">
      <h2 class="mb-3 border-b-2 border-black text-lg font-bold uppercase">
        Projects
      </h2>
      <div class="flex flex-col gap-4">
        <div v-for="(project, key) in projects" :key="key" class="flex flex-col">
          <div class="mb-1 flex items-baseline justify-between border-b border-gray-200 pb-0.5">
            <div class="flex items-baseline gap-2">
              <h3 class="text-base font-bold">
                {{ project.title }}
              </h3>
              <span class="text-sm text-gray-700 italic">– {{ project.org }}</span>
            </div>
            <!-- Date for projects if available, otherwise hide -->
            <span v-if="project.start" class="text-sm font-medium whitespace-nowrap italic">
              {{ project.start }} - {{ project.end }}
            </span>
          </div>

          <p v-if="project.reducedBody" class="mb-1 text-sm">
            {{ project.reducedBody }}
          </p>

          <ul v-if="project.delivered" class="ml-4 list-outside list-disc space-y-0.5 text-sm">
            <li v-for="(item, index) in project.delivered" :key="index" class="pl-1">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Education -->
    <section v-if="education && education.length">
      <h2 class="mb-3 border-b-2 border-black text-lg font-bold uppercase">
        Education
      </h2>
      <div class="flex flex-col gap-2">
        <div v-for="(edu, key) in education" :key="key" class="flex flex-col">
          <div class="flex items-baseline justify-between">
            <h3 class="text-base font-bold">
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
