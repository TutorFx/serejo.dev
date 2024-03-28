<template>
    <div class="bg-base-100 rounded-2xl grid grid-rows-[max-content_1fr] overflow-hidden aspect-[3/4]">
        <div class="p-6 grid gap-3">
            <div class="text-3xl text-center">
                {{ item.title }}
            </div>
            <div class="text-center text-balance mx-auto">
                <MDC :value="item" />
            </div>
            <div class="grid items-center grid-flow-col justify-center gap-3">
                <NuxtLink v-if="item.github" :href="item.github">
                    <Icon size="28" name="mdi:github" />
                </NuxtLink>
                <NuxtLink v-if="item.url" :href="item.url">
                    <Icon size="24" name="mage:external-link" />
                </NuxtLink>
            </div>
        </div>
        <div class="relative overflow-hidden">
            <div v-if="item.scroller" class="absolute">
                <NuxtImg class="animate-marquee-y" width="400" lazyload :src="`/projects/scroll-img/${item.scroller}`" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type ProjectController from '~/utils/cms/project/ProjectController';

defineProps<{
    item: ProjectController
}>()
</script>