<script setup lang="ts">
import type HistoryController from '~/utils/cms/history/HistoryController'

defineProps<{
  item: HistoryController
}>()
</script>

<template>
  <div class="rounded-md bg-base-300 aspect-video grid select-none bg-opacity-50 p-6 grid-rows-[1fr] [.current_&]:bg-opacity-100 [.current_&]:bg-brand-gradient transition-all cursor-grab">
    <div class="[.current_&]:text-white">
      {{ (new Date(item.start)).getFullYear() }}
    </div>
    <div class="[.current_&]:text-white text-2xl font-black">
      {{ item.org }}
    </div>
  </div>
</template>
