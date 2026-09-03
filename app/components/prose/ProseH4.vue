<script setup lang="ts">
const props = defineProps<{ id?: string }>()
</script>

<template>
  <h4 :id="props.id" class="py-6 text-xl">
    <a
      v-if="props.id"
      :href="`#${props.id}`"
    >
      <slot />
    </a>
    <slot v-else />
  </h4>
</template>
