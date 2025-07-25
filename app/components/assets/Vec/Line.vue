<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

const isIntersecting = ref(false)
const lineRef = useTemplateRef<SVGElement>('lineRef')
const id = useId()

const { stop } = useIntersectionObserver(
  lineRef,
  ([entry]) => {
    isIntersecting.value = entry?.isIntersecting ?? false
  },
  { threshold: 0.1 },
)

onBeforeUnmount(() => {
  stop()
})
</script>

<template>
  <svg
    ref="lineRef"
    class="overflow-visible line-drawing"
    :class="{ 'is-drawing': isIntersecting }"
    viewBox="0 0 1365 672"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M-52.3139 231.34C522.311 15.1499 738.014 -32.4809 822.066 90.3251C924.727 279.5 476.727 587.088 365.566 493.325C273.346 415.539 315.227 258.4 734.065 224.325C945.682 207.109 1059.07 236.949 1170 303.5C1268.16 362.39 1371 489.5 1333 667"
      :stroke="`url(#paint-${id})`"
      stroke-width="46"
      :filter="`url(#glow-${id})`"
    />
    <defs>
      <linearGradient
        :id="`paint-${id}`"
        x1="-26.7003"
        y1="128.658"
        x2="1026.55"
        y2="538.389"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stop-color="var(--brand-1)" />
        <stop offset="10%" stop-color="var(--brand-2)" />
        <stop offset="20%" stop-color="var(--brand-3)" />
        <stop offset="30%" stop-color="var(--brand-4)" />
        <stop offset="40%" stop-color="var(--brand-5)" />
        <stop offset="50%" stop-color="var(--brand-6)" />
        <stop offset="60%" stop-color="var(--brand-7)" />
        <stop offset="70%" stop-color="var(--brand-8)" />
        <stop offset="80%" stop-color="var(--brand-9)" />
        <stop offset="90%" stop-color="var(--brand-10)" />
      </linearGradient>

      <filter :id="`glow-${id}`" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="15" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  </svg>
</template>

<style scoped>
.line-drawing path {
  stroke-dasharray: 3200;
  stroke-dashoffset: 3200;
  transition: stroke-dashoffset 5s cubic-bezier(0.16, 1, 0.3, 1);
}

.line-drawing.is-drawing path {
  stroke-dashoffset: 0;
}
</style>
