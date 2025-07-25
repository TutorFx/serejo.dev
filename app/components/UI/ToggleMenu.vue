<script lang="ts">

</script>

<script setup lang="ts">
const model = defineModel<boolean>({ default: false })
</script>

<template>
  <div class="lg:hidden grid items-center" @click="model = !model">
    <Icon v-if="model" size="28" name="line-md:close-small" />
    <Icon v-else size="28" name="line-md:menu" />
  </div>
</template>
