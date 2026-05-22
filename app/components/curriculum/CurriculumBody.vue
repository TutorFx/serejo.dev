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
  <div class="bg-base-100 text-base-content @container grid grid-cols-12 items-start gap-1 px-4">
    <div class="col-span-5 grid gap-6 @7xl:col-span-3">
      <div class="relative grid gap-8">
        <div class="text-accent absolute left-2 py-2 text-sm">
          <div class="aspect-square rotate-270 transform text-end uppercase">
            {{ $t('sections.statement.title') }}
          </div>
        </div>
        <div class="pl-8 text-balance">
          {{ $t('me.summary') }}
        </div>
      </div>
      <div class="relative grid gap-8">
        <div class="text-accent absolute left-2 py-2 text-sm">
          <div class="aspect-square rotate-270 transform text-end uppercase">
            {{ $t('curriculum.education') }}
          </div>
        </div>
        <div class="grid gap-4 pl-8">
          <div v-for="(graduation, key) in education" :key>
            <div class="grid">
              <div class="text-lg font-semibold">
                {{ graduation.org }}
              </div>
              <div class="text-neutral-content -mt-1 grid grid-flow-col items-center justify-start gap-1 text-sm font-bold">
                {{ graduation.date }}
              </div>
              <div class="mt-2">
                {{ graduation.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid aspect-square items-center justify-center">
        <Qrcode
          data-allow-mismatch
          render-as="svg"
          background="var(--base-100)"
          foreground="var(--base-content)"
          :size="140"
          value="https://serejo.dev"
          level="L"
        />
      </div>
    </div>
    <div class="col-span-7 @7xl:col-span-9">
      <div class="relative">
        <div class="text-accent absolute left-2 py-2 text-sm">
          <div class="aspect-square rotate-270 transform text-end uppercase">
            {{ $t('sections.experiences.title') }}
          </div>
        </div>
        <div class="@container grid grid-cols-12 gap-8 pl-8">
          <div v-for="(experience, key) in experiences" :key class="col-span-full grid items-start gap-3 @3xl:col-span-6 @6xl:col-span-4">
            <div class="grid grid-flow-col items-start justify-start gap-3">
              <div class="grid size-14 items-center justify-center overflow-hidden rounded-xl bg-black">
                <NuxtImg class="size-14" :src="experience.image" />
              </div>
              <div class="grid gap-1">
                <div class="text-xl font-semibold">
                  {{ experience.title }} • {{ experience.org }}
                </div>
                <div class="grid grid-flow-col items-end justify-start gap-3">
                  <div class="bg-accent/35 grid grid-flow-col items-center justify-start gap-1 rounded-lg px-1 py-0.5 text-xs font-bold @md:text-sm">
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
              <ul v-if="experience.delivered" class="grid list-inside list-disc gap-1 px-4">
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
