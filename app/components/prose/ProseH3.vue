<script setup lang="ts">
const props = defineProps<{ id?: string }>()
</script>

<template>
  <h3 :id="props.id" class="py-6 text-2xl font-bold">
    <a
      v-if="props.id"
      :href="`#${props.id}`"
    >
      <slot />
    </a>
    <slot v-else />
  </h3>
</template>
