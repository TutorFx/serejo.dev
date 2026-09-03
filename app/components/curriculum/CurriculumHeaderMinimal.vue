<script setup lang="ts">
defineProps<{
  title: string
  profession?: string
  contact: { key: string, value: string }[]
}>()
</script>

<template>
  <div class="header-minimal flex flex-col items-start justify-between gap-2 bg-white text-black sm:flex-row sm:gap-0">
    <!-- Left: Name and Title -->
    <div class="flex flex-col">
      <h1 class="header-name leading-none font-extrabold tracking-wide uppercase">
        {{ title }}
      </h1>
      <h2 v-if="profession" class="header-profession font-medium tracking-wider text-gray-600">
        {{ profession }}
      </h2>
    </div>

    <!-- Right: Contact Info -->
    <div class="header-contact flex flex-col items-start leading-tight sm:items-end">
      <div v-for="(item, key) in contact" :key="key" class="flex gap-1">
        <span class="font-bold">{{ item.key }}:</span>
        <span>{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-minimal {
  padding-top: var(--padding-y, 1.5rem);
  padding-bottom: calc(var(--padding-y, 1.5rem) * 0.25);
  padding-left: var(--padding-x, 1.5rem);
  padding-right: var(--padding-x, 1.5rem);
}
.header-name {
  font-size: var(--header-name-size, 2rem);
}
.header-profession {
  font-size: calc(var(--body-font-size, 0.875rem) * 1.05);
}
.header-contact {
  font-size: var(--body-font-size, 0.875rem);
  gap: calc(var(--item-gap, 0.5rem) * 0.5);
}
</style>
