<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { gsap } from 'gsap'

const { y } = useWindowScroll()

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
</script>

<template>
  <div ref="wheel" class="relative" :class="{ 'animate-[spin_10s_linear_infinite]': !isMounted }">
    <div class="absolute">
      <AssetsVecCircularText class="text-primary translate-y-[-50%] translate-x-[-50%] scale-125" />
    </div>
  </div>
</template>
