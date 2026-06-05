<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, onActivated, onDeactivated } from 'vue'
import { useFluidOrb } from '~/composables/useFluidOrb'

const props = withDefaults(defineProps<{
  scale?: number
  colors?: string[]
}>(), {
  scale: 1.0,
  colors: () => []
})

const canvasContainer = ref<HTMLElement | null>(null)
const colormode = useColorMode()

const { init, play, pause, dispose, setScale, setLightMode, updateColors } = useFluidOrb()

onMounted(() => {
  if (!canvasContainer.value) return

  const isLight = colormode.value === 'light'
  init(canvasContainer.value, props.scale, isLight)

  if (props.colors && props.colors.length > 0) {
    updateColors(props.colors)
  }

  play()
})

onActivated(() => {
  play()
})

onDeactivated(() => {
  pause()
})

watch(() => props.scale, (newScale) => {
  setScale(newScale)
})

watch(() => colormode.value, (newMode) => {
  setLightMode(newMode === 'light')
})

watch(() => props.colors, (newColors) => {
  if (newColors && newColors.length > 0) {
    updateColors(newColors)
  }
}, { deep: true })

onBeforeUnmount(() => {
  dispose()
})
</script>

<template>
  <div ref="canvasContainer" class="relative h-full w-full" />
</template>
