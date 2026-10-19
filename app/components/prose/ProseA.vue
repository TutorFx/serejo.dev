<script setup lang="ts">
import { SITE_URL } from '#shared/utils/constants'
import { resolveSafeLink } from '~/utils/ai/url'

const props = defineProps<{
  href?: string
  target?: '_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined
}>()

// Rendered for blog content and for model output: unsafe protocols (javascript:, data:) become plain text
const link = computed(() => resolveSafeLink(props.href, SITE_URL))
</script>

<template>
  <NuxtLink
    v-if="link"
    :href="link.href"
    :target="link.external ? '_blank' : props.target"
    :rel="link.external ? 'noopener noreferrer nofollow' : undefined"
    class="relative inline-block before:absolute before:top-full before:left-0 before:h-1 before:w-full before:rounded-xs before:bg-linear-(--brand-gradient) before:content-['']"
  >
    <slot />
  </NuxtLink>
  <span v-else>
    <slot />
  </span>
</template>
