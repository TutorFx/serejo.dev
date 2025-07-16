<script lang="ts">
export interface LocaleIconProps {
  countryCode: string
}
</script>

<script setup lang="ts">
defineProps<LocaleIconProps>()
</script>

<template>
  <Icon size="32" v-if="countryCode === 'pt-BR'" name="circle-flags:br" />
  <Icon size="32" v-else-if="countryCode === 'en-US'" name="circle-flags:en" />
</template>