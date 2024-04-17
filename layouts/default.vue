<script setup lang="ts">
import { FeatureFlags } from '~/utils/flags/Flags'
</script>

<template>
  <main class="grid grid-rows-[max-content_1fr_max-content] min-h-[100svh]">
    <Feature :name="FeatureFlags.CURSOR">
      <CursorViewport />
    </Feature>
    <Feature :name="FeatureFlags.CHAT">
      <Chat lazyload />
    </Feature>
    <Header />
    <slot />
    <Footer />
  </main>
</template>
