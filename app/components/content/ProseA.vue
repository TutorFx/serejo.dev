<script setup lang="ts">
const props = defineProps<{
  href: string
  target?: '_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined
}>()
</script>

<template>
  <NuxtLink
    :href="props.href"
    :target="props.target"
    class="relative inline-block before:absolute before:top-full before:left-0 before:h-1 before:w-full before:rounded-xs before:bg-linear-(--brand-gradient) before:content-['']"
  >
    <slot />
  </NuxtLink>
</template>
