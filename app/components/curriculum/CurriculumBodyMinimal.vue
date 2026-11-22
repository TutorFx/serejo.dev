<script lang="ts">
export interface CurriculumBody {
  experiences: ExperiencesDto[]
  education: EducationDto[]
  skills?: SkillGroupDto[]
  certifications?: string[] // Simple string array for now as minimal view
}
</script>

<script setup lang="ts">
const { t } = useI18n()
defineProps<CurriculumBody>()
</script>

<template>
  <!-- Sections, their order and the layout of each entry follow the CV -->
  <div class="mx-auto flex max-w-[21cm] flex-col gap-6 bg-white px-4 py-6 text-black">
    <!-- Statement / Summary -->
    <section class="mb-2">
      <h2 class="mb-2 border-b-2 border-black text-lg font-bold uppercase">
        {{ t('curriculum.summary') }}
      </h2>
      <p class="text-justify text-sm leading-relaxed">
        {{ t('me.summary') }}
      </p>
    </section>

    <!-- Technical Skills -->
    <section v-if="skills && skills.length">
      <h2 class="mb-2 border-b-2 border-black text-lg font-bold uppercase">
        {{ t('curriculum.technical_proficiencies') }}
      </h2>
      <ul class="flex flex-col gap-1 text-sm">
        <li v-for="group in skills" :key="group.title">
          <span class="font-bold">{{ group.title }}</span>: {{ group.items }}
        </li>
      </ul>
    </section>

    <!-- Professional Experience -->
    <section v-if="experiences && experiences.length">
      <h2 class="mb-3 border-b-2 border-black text-lg font-bold uppercase">
        {{ t('curriculum.professional_experience') }}
      </h2>
      <div class="flex flex-col gap-4">
        <div v-for="(experience, key) in experiences" :key="key" class="flex flex-col">
          <div class="flex items-baseline justify-between gap-4">
            <h3 class="text-base font-bold">
              {{ experience.org }}
            </h3>
            <span class="text-sm font-medium whitespace-nowrap">
              {{ experience.start }} - {{ experience.end }}
            </span>
          </div>
          <div class="mb-1 flex items-baseline justify-between gap-4 text-sm italic">
            <span>{{ experience.title }}</span>
            <span class="whitespace-nowrap">{{ experience.location }}</span>
          </div>

          <ul v-if="experience.delivered" class="ml-4 list-outside list-disc space-y-0.5 text-sm">
            <li v-for="(item, index) in experience.delivered" :key="index" class="pl-1">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Certifications -->
    <section v-if="certifications && certifications.length">
      <h2 class="mb-2 border-b-2 border-black text-lg font-bold uppercase">
        {{ t('curriculum.certifications_title') }}
      </h2>
      <div class="flex flex-col gap-1 text-sm">
        <div v-for="cert in certifications" :key="cert" class="flex items-center">
          <span class="mr-2">•</span>
          {{ cert }}
        </div>
      </div>
    </section>

    <!-- Education -->
    <section v-if="education && education.length">
      <h2 class="mb-3 border-b-2 border-black text-lg font-bold uppercase">
        {{ t('curriculum.education') }}
      </h2>
      <div class="flex flex-col gap-2">
        <div v-for="(edu, key) in education" :key="key" class="flex flex-col">
          <div class="flex items-baseline justify-between gap-4">
            <h3 class="text-base font-bold">
              {{ edu.org }}
            </h3>
            <span class="text-sm font-medium whitespace-nowrap">
              {{ edu.date || edu.end }}
            </span>
          </div>
          <div class="flex items-baseline justify-between gap-4 text-sm italic">
            <span>{{ edu.title }}</span>
            <span class="whitespace-nowrap">{{ edu.location }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
