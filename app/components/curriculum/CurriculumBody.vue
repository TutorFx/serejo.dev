<script lang="ts">
import Qrcode from 'qrcode.vue'

export interface CurriculumBody {
  experiences: ExperiencesDto[]
  education: EducationDto[]
}
</script>

<script setup lang="ts">
defineProps<CurriculumBody>()
</script>

<template>
  <div class="grid grid-cols-12 gap-1 items-start px-4 @container bg-base-100 text-base-content">
    <div class="col-span-5 @7xl:col-span-3 grid gap-6">
      <div class="grid gap-8 relative">
        <div class="absolute py-2 text-accent left-2 text-sm">
          <div class="transform rotate-270 text-end aspect-square uppercase">
            {{ $t('sections.statement.title') }}
          </div>
        </div>
        <div class="pl-8 text-balance">
          {{ $t('me.summary') }}
        </div>
      </div>
      <div class="grid gap-8 relative">
        <div class="absolute py-2 text-accent left-2 text-sm">
          <div class="transform rotate-270 text-end aspect-square uppercase">
            {{ $t('curriculum.education') }}
          </div>
        </div>
        <div class="pl-8 grid gap-4">
          <div v-for="(graduation, key) in education" :key>
            <div class="grid">
              <div class="font-semibold text-lg">
                {{ graduation.org }}
              </div>
              <div class="-mt-1 grid grid-flow-col gap-1 justify-start items-center text-sm font-bold text-neutral-content">
                {{ graduation.date }}
              </div>
              <div class="mt-2">
                {{ graduation.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid justify-center items-center aspect-square">
        <Qrcode data-allow-mismatch render-as="svg" background="var(--base-100)" foreground="var(--base-content)" :size="140" value="https://serejo.dev" level="L" />
      </div>
    </div>
    <div class="col-span-7 @7xl:col-span-9">
      <div class="relative">
        <div class="absolute py-2 text-accent left-2 text-sm">
          <div class="transform rotate-270 text-end aspect-square uppercase">
            {{ $t('sections.experiences.title') }}
          </div>
        </div>
        <div class="grid gap-8 pl-8 grid-cols-12 @container">
          <div v-for="(experience, key) in experiences" :key class="grid gap-3 col-span-full @3xl:col-span-6 @6xl:col-span-4 items-start">
            <div class="grid gap-3 grid-flow-col justify-start items-start">
              <div class="size-14 grid justify-center items-center bg-black rounded-xl overflow-hidden">
                <NuxtImg class="size-14" :src="experience.image" />
              </div>
              <div class="grid gap-1">
                <div class="font-semibold text-xl">
                  {{ experience.title }} • {{ experience.org }}
                </div>
                <div class="grid grid-flow-col justify-start items-end gap-3">
                  <div class="grid grid-flow-col gap-1 justify-start items-center text-xs @md:text-sm font-bold bg-accent/35 py-0.5 px-1 rounded-lg">
                    <div class="break-keep">
                      {{ experience.start }}
                    </div>
                    <Icon name="mdi:arrow-right" />
                    <div class="line-clamp-1">
                      {{ experience.end }}
                    </div>
                  </div>
                  <div>
                    {{ experience.location }}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <ul v-if="experience.delivered" class="list-disc list-inside grid gap-1 px-4">
                <li v-for="(item, index) in experience.delivered" :key="index">
                  {{ item }}
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
