<script lang="ts" setup>
import { Icon } from '#components'

const { $gsap } = useNuxtApp()

const mouse = usePointer()
const window = useWindowSize()
const cursor = ref()
const store = useCursorStore()

function onBeforeEnter(el: any) {
  el.style.opacity = 0
  el.style.height = 0
  el.style.scale = 0
}

function onEnter(el: any, done: any) {
  $gsap.to(el, {
    opacity: 1,
    height: 'auto',
    duration: 0.01,
    scale: 0.5,
    onComplete: done,
    ease: 'expo.in',
  })
}

if (import.meta.client) {
  onMounted(() => {
    $gsap.set(cursor.value, { xPercent: -50, yPercent: -50, scale: 0, x: window.width.value / 2, y: window.height.value / 2 })

    const xTo = $gsap.quickTo(cursor.value, 'x', { duration: 0.3, ease: 'expo.out' })
    const yTo = $gsap.quickTo(cursor.value, 'y', { duration: 0.3, ease: 'expo.out' })

    const xS = $gsap.quickTo(cursor.value, 'scaleX', { duration: 0.6, ease: 'power3' })
    const yS = $gsap.quickTo(cursor.value, 'scaleY', { duration: 0.6, ease: 'power3' })

    const { start, stop } = useTimeoutFn(() => {
      xS(1)
      yS(1)
    }, 300)

    const cleanup = useEventListener('mousedown', () => {
      store.resetPointer()
      xS(0.5)
      yS(0.5)
      start()
    })

    watch(() => store.pointer, (cursorPointer) => {
      const s = cursorPointer ? 6 : 1

      xS(s)
      yS(s)
    })

    watch(() => mouse, ({ x, y }) => {
      xTo(x.value)
      yTo(y.value)
    }, { deep: true })

    onBeforeUnmount(() => {
      cleanup()
      stop()
    })
  })
}
</script>

<template>
  <div v-show="cursor" class="fixed inset-0 pointer-events-none width-screen height-screen z-[5000]">
    <div ref="cursor" class="h-6 rounded-full flex items-center justify-center bg-primary/30 w-6 backdrop-blur-sm">
      <ClientOnly>
        <Transition :css="false" @before-enter="onBeforeEnter" @enter="onEnter">
          <Icon v-if="store.pointer" :key="store.pointer.icon" :name="store.pointer.icon" />
        </Transition>
      </ClientOnly>
    </div>
  </div>
</template>
