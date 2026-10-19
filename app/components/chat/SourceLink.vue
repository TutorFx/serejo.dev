<script setup lang="ts">
import { getDomain, getFaviconUrl, toSafeExternalUrl } from '~/utils/ai/url'

// Only `url` is accepted: favicon and label are derived from it, never taken from model output
const props = defineProps<{
  url?: string
}>()

const safeUrl = computed(() => toSafeExternalUrl(props.url))
</script>

<template>
  <UButton
    v-if="safeUrl"
    :to="safeUrl"
    target="_blank"
    rel="noopener noreferrer nofollow"
    :avatar="{ src: getFaviconUrl(safeUrl) }"
    :label="getDomain(safeUrl)"
    trailing-icon="i-lucide-arrow-up-right"
    size="xs"
    color="neutral"
    variant="outline"
    class="rounded-full align-middle"
  />
</template>
