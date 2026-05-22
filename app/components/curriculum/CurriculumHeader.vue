<script setup lang="ts">
defineProps<{
  title: string
  profession: string
  contact: { key: string, value: string }[]
}>()
</script>

<template>
  <div class="bg-base-100 text-base-content @container grid grid-cols-[max-content_max-content] justify-between gap-3 px-8 py-12">
    <div class="grid">
      <div class="text-2xl font-black">
        {{ title }}
      </div>
      <div class="text-accent text-xl">
        {{ profession }}
      </div>
    </div>
    <div class="grid grid-cols-1 gap-x-6 gap-y-3 text-sm @2xl:grid-cols-2">
      <div v-for="(i, key) in contact" :key class="text-base-content grid grid-cols-[max-content_max-content] items-center justify-start gap-1">
        <div class="uppercase">
          {{ i.key }}:
        </div>
        <div>
          {{ i.value }}
        </div>
      </div>
    </div>
  </div>
</template>
