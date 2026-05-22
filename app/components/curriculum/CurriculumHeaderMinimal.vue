<script setup lang="ts">
defineProps<{
  title: string
  profession: string
  contact: { key: string, value: string }[]
}>()
</script>

<template>
  <div class="mx-auto mb-1 flex max-w-[21cm] items-start justify-between border-b-2 border-black bg-white px-4 pt-6 pb-2 text-black">
    <!-- Left: Name and Title -->
    <div class="flex flex-col">
      <h1 class="text-2xl leading-none font-extrabold tracking-wide uppercase">
        {{ title }}
      </h1>
      <h2 class="text-sm font-medium tracking-wider text-gray-600">
        {{ profession }}
      </h2>
    </div>

    <!-- Right: Contact Info -->
    <div class="flex flex-col items-end gap-1 text-sm leading-tight">
      <div v-for="(item, key) in contact" :key="key" class="flex gap-1">
        <span class="font-bold">{{ item.key }}:</span>
        <span>{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>
