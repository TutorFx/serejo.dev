<script setup lang="ts">
import { NAVBAR_CONTENT } from '~/utils/constants'
import { useMenu } from '~/composables/useMenu'

const menuList = useMenu(NAVBAR_CONTENT)
</script>

<template>
  <div
    class="bg-base-100 text-base-content grid min-h-full grid-rows-[max-content_1fr_max-content]"
  >
    <UIHeadersCoreHeader :list="menuList" />
    <ChatPopup />
    <NuxtPage />
    <UIFootersDefault />
  </div>
</template>
