<template>
    <div class="bg-base-300 p-6 aspect-video grid grid-rows-[1fr] [.current_&]:bg-brand-gradient select-none">
        <div class="[.current_&]:text-white">
            {{ (new Date(item.start)).getFullYear() }}
        </div>
        <div class="font-black [.current_&]:text-white text-2xl">
            {{ item.org }}
        </div>
    </div>
</template>

<script setup lang="ts">
import HistoryController from '~/utils/cms/history/HistoryController';

defineProps<{
    item: HistoryController
}>()
</script>