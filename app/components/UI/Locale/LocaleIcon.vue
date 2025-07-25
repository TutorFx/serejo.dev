<script lang="ts">
export interface LocaleIconProps {
  countryCode: string
}
</script>

<script setup lang="ts">
defineProps<LocaleIconProps>()
</script>

<template>
  <Icon v-if="countryCode === 'pt-BR'" size="32" name="circle-flags:br" />
  <Icon v-else-if="countryCode === 'en-US'" size="32" name="circle-flags:en" />
</template>
