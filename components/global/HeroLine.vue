<script setup lang="ts">
const props = withDefaults(defineProps<{
  value?: number
}>(), {
  value: 100,
})

const clamp = computed(() => Math.max(0, Math.min((100 - props.value), 100)))

const completion = computed(() => clamp.value * 32)
</script>

<template>
  <svg stroke-dasharray="3200" :stroke-dashoffset="completion" width="1365" height="672" viewBox="0 0 1365 672" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M-52.3139 231.34C522.311 15.1499 738.014 -32.4809 822.066 90.3251C924.727 279.5 476.727 587.088 365.566 493.325C273.346 415.539 315.227 258.4 734.065 224.325C945.682 207.109 1059.07 236.949 1170 303.5C1268.16 362.39 1371 489.5 1333 667"
      stroke="url(#paint)" stroke-width="46"
    />
    <defs>
      <linearGradient
        id="paint" x1="-26.7003" y1="128.658" x2="1026.55"
        y2="538.389" gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stop-color="#f72585" />
        <stop offset="10%" stop-color="#b5179e" />
        <stop offset="20%" stop-color="#7209b7" />
        <stop offset="30%" stop-color="#560bad" />
        <stop offset="40%" stop-color="#480ca8" />
        <stop offset="50%" stop-color="#3a0ca3" />
        <stop offset="60%" stop-color="#3f37c9" />
        <stop offset="70%" stop-color="#4361ee" />
        <stop offset="80%" stop-color="#4895ef" />
        <stop offset="90%" stop-color="#4cc9f0" />
      </linearGradient>
    </defs>
  </svg>
</template>
