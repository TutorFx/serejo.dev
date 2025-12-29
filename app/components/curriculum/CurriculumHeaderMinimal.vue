<script setup lang="ts">
defineProps<{
  title: string
  profession: string
  contact: { key: string, value: string }[]
}>()
</script>

<template>
  <div class="flex justify-between items-start pt-12 px-8 pb-4 bg-white text-black max-w-[21cm] mx-auto border-b-2 border-black mb-2">
    <!-- Left: Name and Title -->
    <div class="flex flex-col">
      <h1 class="text-4xl font-extrabold uppercase tracking-wide leading-none">
        {{ title }}
      </h1>
      <h2 class="text-lg font-medium text-gray-600 tracking-wider">
        {{ profession }}
      </h2>
    </div>

    <!-- Right: Contact Info -->
    <div class="flex flex-col items-end text-sm leading-tight gap-1">
      <div v-for="(item, key) in contact" :key="key" class="flex gap-1">
        <span class="font-bold">{{ item.key }}:</span>
        <span>{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>
