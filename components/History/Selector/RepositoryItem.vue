<script setup lang="ts">
import type HistoryController from '~/utils/cms/history/HistoryController'

defineProps<{
  item: HistoryController
}>()
</script>

<template>
  <div class="bg-base-300 [.current_&]:bg-brand-gradient grid grid-rows-[1fr] aspect-video cursor-grab select-none rounded-md bg-opacity-50 p-6 transition-all [.current_&]:bg-opacity-100">
    <div class="[.current_&]:text-white">
      {{ (new Date(item.start)).getFullYear() }}
    </div>
    <div class="text-2xl font-black [.current_&]:text-white">
      {{ item.org }}
    </div>
  </div>
</template>
