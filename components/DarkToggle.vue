<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

withDefaults(
  defineProps<{ justIcon?: boolean }>(),
  { justIcon: false },
)

const color = useColorMode()

useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#222222' : '#ffffff',
  }],
})

function toggleDark() {
  color.preference = color.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button v-hoverable:lightmode class="grid grid-flow-col items-center justify-start gap-3 !outline-none" @click="toggleDark">
    <Icon v-if="color.value === 'dark'" prefetch v-bind="$attrs" name="i-carbon-moon" />
    <Icon v-else prefetch v-bind="$attrs" name="i-carbon-sun" />
    <label :class="{ 'sr-only': justIcon }">
      {{ $t('active') }}: {{ color.value === 'light' ? $t('settings.light_mode') : $t('settings.dark_mode') }}
    </label>
  </button>
</template>
