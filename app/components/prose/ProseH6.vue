<script setup lang="ts">
const props = defineProps<{ id?: string }>()
</script>

<template>
  <h6 :id="props.id">
    <a
      v-if="props.id"
      :href="`#${props.id}`"
    >
      <slot />
    </a>
    <slot v-else />
  </h6>
</template>
