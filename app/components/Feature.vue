<script setup lang="ts">
import type { FeatureFlags } from '~/app/utils/flags/Flags'

const props = defineProps<{
  name: FeatureFlags
}>()
const { $featureStore } = useNuxtApp()
const store = $featureStore()
const isActive = computed(() => store.features.check(props.name))
</script>

<template>
  <slot v-if="isActive" />
  <slot v-else name="fallback" />
</template>
