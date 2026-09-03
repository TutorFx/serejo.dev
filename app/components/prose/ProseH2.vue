<script setup lang="ts">
const props = defineProps<{ id?: string }>()
</script>

<template>
  <h2 :id="props.id" class="py-6 text-3xl font-bold">
    <a
      v-if="props.id"
      :href="`#${props.id}`"
    >
      <slot />
    </a>
    <slot v-else />
  </h2>
</template>
