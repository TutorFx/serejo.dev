<script setup lang="ts">
export interface StackLogo {
  name: string
  src: string
  color: string
  /** A single dark shape: painted with the text colour to stay visible in both themes */
  mono: boolean
}

defineProps<{
  logos: readonly StackLogo[]
  active: number
  /** Cast a shadow behind each logo. The hero renders this copy inside the coloured strip, which cuts it */
  shadow?: boolean
}>()

function maskStyle(src: string) {
  const mask = `url(${src}) center / contain no-repeat`

  return { mask, WebkitMask: mask }
}
</script>

<template>
  <!-- The parent sets the width and the positioning (relative or absolute) -->
  <div class="aspect-square">
    <div
      v-for="(logo, index) in logos"
      :key="logo.name"
      class="absolute inset-x-0 top-0 bottom-2 transition-transform duration-500 lg:bottom-4"
      :class="[
        index === active ? 'translate-y-0 delay-300' : 'translate-y-[150%]',
        { 'drop-shadow-[0_6px_10px_rgb(0_0_0/0.55)]': shadow },
      ]"
    >
      <div v-if="logo.mono" class="size-full bg-current" :style="maskStyle(logo.src)" />
      <NuxtImg v-else :src="logo.src" alt="" width="288" class="size-full object-contain" />
    </div>
  </div>
</template>
