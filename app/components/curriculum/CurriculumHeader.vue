<script setup lang="ts">
defineProps<{ 
  title: string 
  profession: string
  contact: { key: string, value: string }[]
}>()
</script>

<template>
  <div class="grid gap-3 grid-cols-[max-content_max-content] justify-between py-12 px-8 @container bg-base-100 text-base-content">
    <div class="grid">
      <div class="text-2xl font-black">
        {{ title }}
      </div>
      <div class="text-xl text-accent">
        {{ profession }}
      </div>
    </div>
    <div class="grid grid-cols-1 @2xl:grid-cols-2 gap-y-3 gap-x-6 text-sm">
      <div v-for="i in contact" class="grid grid-cols-[max-content_max-content] text-base-content items-center justify-start gap-1">
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