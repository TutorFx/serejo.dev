<script setup lang="ts">
import type ProjectController from '~/utils/cms/project/ProjectController'

defineProps<{
  item: ProjectController
}>()
</script>

<template>
  <div class="bg-base-100 relative grid grid-rows-[max-content_1fr] aspect-square overflow-hidden rounded-2xl md:aspect-[3/4]">
    <div class="relative grid">
      <div class="from-base-100 to-base-100/0 [text-shadow:_6px_1px_20px_var(--fallback-b1,oklch(var(--b1)/1))] relative z-[1] grid gap-3 bg-gradient-to-b px-4 py-12 lg:py-18">
        <div class="text-center text-3xl">
          {{ item.title }}
        </div>
        <div class="mx-auto text-center text-balance text-neutral">
          <MDC :value="item" />
        </div>
        <div class="grid grid-flow-col items-center justify-center gap-3">
          <NuxtLink v-if="item.github" v-hoverable:github :href="item.github" target="_blank">
            <Icon size="28" name="mdi:github" />
          </NuxtLink>
          <NuxtLink v-if="item.url" v-hoverable:external :href="item.url" target="_blank">
            <Icon size="24" name="mage:external-link" />
          </NuxtLink>
        </div>
        <div class="bg-base-100 absolute inset-0 rounded-full blur-3xl -z-[1]" />
      </div>
    </div>
    <div class="relative z-[0]">
      <div class="absolute inset-0 rotate-[60deg]">
        <div class="relative">
          <NuxtImg
            v-if="item.scroller" class="animate-marquee-y w-full" width="200" lazyload
            :src="`/projects/scroll-img/${item.scroller}`"
          />
        </div>
      </div>
    </div>
  </div>
</template>
