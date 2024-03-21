<script setup lang="ts">
const color = useColorMode()

useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#222222' : '#ffffff',
  }],
})

defineOptions({
  inheritAttrs: false,
})

function toggleDark() {
  color.preference = color.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button class="!outline-none" @click="toggleDark">
    <Icon v-bind="$attrs" v-if="color.value === 'dark'" name="i-carbon-moon" />
    <Icon v-bind="$attrs" v-else name="i-carbon-sun" />
  </button>
</template>
