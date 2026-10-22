<script setup lang="ts">
const color = useColorMode()
const { t } = useI18n()
// The stored preference is only known in the browser: expose the pressed state after mount
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

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
  <button
    type="button"
    class="focus-visible:outline-primary grid items-center justify-center rounded-full focus-visible:outline-2"
    :aria-label="t('settings.dark_mode')"
    :aria-pressed="mounted ? color.value === 'dark' : undefined"
    @click="toggleDark"
  >
    <ClientOnly>
      <Icon
        v-if="color.preference === 'dark'"
        size="32"
        name="line-md:sunny-outline-to-moon-alt-loop-transition"
      />
      <Icon v-else size="32" name="line-md:moon-alt-to-sunny-outline-loop-transition" />
      <template #fallback>
        <div class="grid items-center">
          <Icon size="32" name="line-md:loading-twotone-loop" />
        </div>
      </template>
    </ClientOnly>
  </button>
</template>
