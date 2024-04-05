<script setup lang="ts">
import type { FeatureFlags } from '@/utils/flags/Flags';

const { $featureStore } = useNuxtApp()
const props = defineProps<{
    name: FeatureFlags
}>()
const store = $featureStore()
const isActive = computed(() => store.features.check(props.name))
</script>

<template>
    <slot v-if="isActive" />
    <slot name="fallback" v-else />
</template>