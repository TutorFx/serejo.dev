<script setup lang="ts">
import { usePreferredReducedMotion, useWindowScroll } from '@vueuse/core'
import { gsap } from 'gsap'

const { y } = useWindowScroll()
const reducedMotion = usePreferredReducedMotion()

const direction = ref(1)
const rotation = ref(0)
const wheel = ref<HTMLElement | null>(null)
const isMounted = ref(false)

const applyRotation = computed(() => wheel.value
  ? gsap.quickTo(wheel.value, 'rotation', {
    duration: 0.6,
    ease: 'power5',
  })
  : () => null)

function ticker(time: number, timeDelta: number) {
  // The ring is decorative: it stands still for visitors who ask for reduced motion
  if (reducedMotion.value === 'reduce')
    return
  rotation.value += ((timeDelta * 0.01) * direction.value)
  applyRotation.value(rotation.value + (y.value * 0.5))
}

onMounted(() => {
  isMounted.value = true
})

watch(() => y.value, (after, before) => {
  direction.value = after > before ? -1 : 1
})

useGsap(() => {
  gsap.ticker.add(ticker)
})

// gsap.context() does not track ticker listeners: without this, each visit adds another one
onUnmounted(() => {
  gsap.ticker.remove(ticker)
})
</script>

<template>
  <div
    ref="wheel"
    class="relative"
    :class="{ 'animate-[spin_10s_linear_infinite] motion-reduce:animate-none': !isMounted }"
  >
    <div class="absolute">
      <AssetsVecCircularText class="text-primary translate-x-[-50%] translate-y-[-50%] scale-125" />
    </div>
  </div>
</template>
