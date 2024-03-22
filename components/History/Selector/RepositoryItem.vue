<script setup lang="ts">
import type HistoryController from '~/utils/cms/history/HistoryController'

defineProps<{
  item: HistoryController
}>()
</script>

<template>
  <div class="rounded-md bg-base-300 p-6 aspect-video grid grid-rows-[1fr] bg-opacity-50 [.current_&]:bg-opacity-100 [.current_&]:bg-brand-gradient select-none transition-all">
    <div class="[.current_&]:text-white">
      {{ (new Date(item.start)).getFullYear() }}
    </div>
    <div class="font-black [.current_&]:text-white text-2xl">
      {{ item.org }}
    </div>
  </div>
</template>
