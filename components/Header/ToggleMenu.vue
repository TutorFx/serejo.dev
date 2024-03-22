<script setup lang="ts">
const model = defineModel<boolean>()
</script>

<template>
  <div @click="model = !model">
    <Icon v-if="!model" size="32" keepalive name="line-md:menu" />
    <Icon v-else size="32" keepalive name="line-md:menu-to-close-alt-transition" />
  </div>
</template>
