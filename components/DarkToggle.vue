<script setup lang="ts">
const color = useColorMode()


withDefaults(
  defineProps<{ justIcon?: boolean }>(),
  { justIcon: false }
)

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
  <button class="!outline-none grid grid-flow-col items-center justify-start gap-3" @click="toggleDark">
    <Icon v-bind="$attrs" v-if="color.value === 'dark'" name="i-carbon-moon" />
    <Icon v-bind="$attrs" v-else name="i-carbon-sun" />
    <label :class="{'sr-only': justIcon }">
      {{ $t('active') }}: {{ color.value === 'light' ? $t('settings.light_mode') : $t('settings.dark_mode') }}
    </label>
  </button>
</template>
