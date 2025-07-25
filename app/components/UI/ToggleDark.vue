<script setup lang="ts">
const color = useColorMode()

useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#0c0a09' : '#ffffff',
  }],
})

function toggleDark() {
  color.preference = color.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button class="!outline-none grid items-center justify-center" @click="toggleDark">
    <ClientOnly>
      <Icon v-if="color.preference === 'dark'" size="32" name="line-md:sunny-outline-to-moon-alt-loop-transition" />
      <Icon v-else size="32" name="line-md:moon-alt-to-sunny-outline-loop-transition" />
      <template #fallback>
        <div class="grid items-center">
          <Icon size="32" name="line-md:loading-twotone-loop" />
        </div>
      </template>
    </ClientOnly>
  </button>
</template>
