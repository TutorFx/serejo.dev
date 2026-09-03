<script setup lang="ts">
import { NAVBAR_CONTENT } from '~/utils/constants'
import { useMenu } from '~/composables/useMenu'
</script>

<template>
  <div class="bg-base-100 text-base-content grid min-h-full grid-rows-[max-content_1fr_max-content]">
    <UIHeadersCoreHeader :list="useMenu(NAVBAR_CONTENT)" />
    <ChatPopup />
    <NuxtPage />
    <UIFootersDefault />
  </div>
</template>
