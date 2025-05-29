<script setup lang="ts">
import type ProjectController from '~/app/utils/cms/project/ProjectController'

defineProps<{
  item: ProjectController
}>()
</script>

<template>
  <div class="bg-base-100 grid overflow-hidden relative aspect-square grid-rows-[max-content_1fr] rounded-2xl md:aspect-[3/4]">
    <div class="grid relative">
      <div class="grid gap-3 relative py-12 z-[1] px-4 bg-gradient-to-b from-base-100 to-base-100/0 [text-shadow:_6px_1px_20px_var(--fallback-b1,oklch(var(--b1)/1))] lg:py-18">
        <div class="text-3xl text-center">
          {{ item.title }}
        </div>
        <div class="text-center mx-auto text-neutral text-balance">
          <MDC :value="item" />
        </div>
        <div class="grid items-center grid-flow-col justify-center gap-3">
          <NuxtLink v-if="item.github" v-hoverable:github :href="item.github" target="_blank">
            <Icon size="28" name="mdi:github" />
          </NuxtLink>
          <NuxtLink v-if="item.url" v-hoverable:external :href="item.url" target="_blank">
            <Icon size="24" name="mage:external-link" />
          </NuxtLink>
        </div>
        <div class="absolute rounded-full bg-base-100 inset-0 blur-3xl -z-[1]" />
      </div>
    </div>
    <div class="relative z-[0]">
      <div class="absolute inset-0 rotate-[60deg]">
        <div class="relative">
          <NuxtImg
            v-if="item.scroller" class="w-full animate-marquee-y" width="200" lazyload
            :src="`/projects/scroll-img/${item.scroller}`"
          />
        </div>
      </div>
    </div>
  </div>
</template>
