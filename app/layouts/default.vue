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
    <NuxtPage />
    <UIFootersDefault />
    <!-- Last: on the server <ClientOnly> leaves an empty <span>, which took the 1fr row of the page and
         pushed it down until hydration (layout shift on short pages). The chat itself is teleported to <body> -->
    <ChatPopup />
  </div>
</template>
