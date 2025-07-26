<template>
  <NuxtLink
    :href="props.href"
    :target="props.target"
    class="relative inline-block before:content-[''] before:absolute before:top-full before:w-full before:left-0 before:h-1 before:rounded-xs before:bg-linear-(--brand-gradient)"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  href: {
    type: String,
    default: ''
  },
  target: {
    type: String as PropType<'_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined>,
    default: undefined,
    required: false
  }
})
</script>