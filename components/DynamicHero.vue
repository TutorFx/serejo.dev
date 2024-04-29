<script setup lang="ts">
const { $gsap } = useNuxtApp()

const itemOneRef = ref<null | HTMLElement>(null)
const itemTwoRef = ref<null | HTMLElement>(null)
const itemThreeRef = ref<null | HTMLElement>(null)
const itemFourRef = ref<null | HTMLElement>(null)
const itemFiveRef = ref<null | HTMLElement>(null)

onMounted(() => {
  if (import.meta.client) {
    const tl = $gsap.timeline({ repeat: 2, repeatDelay: 1 })

    tl.to(itemOneRef.value, {
      duration: 6,
      x: '+=150',
      y: '+=60',
      ease: 'power4.inOut',
      repeat: -1,
      yoyo: true,
    })

    tl.to(itemTwoRef.value, {
      duration: 9,
      x: '-=60',
      y: '+=140',
      ease: 'power4.inOut',
      repeat: -1,
      yoyo: true,
    })

    tl.to(itemThreeRef.value, {
      duration: 4,
      x: '+=190',
      y: '+=60',
      ease: 'power4.inOut',
      repeat: -1,
      yoyo: true,
    })

    tl.to(itemFourRef.value, {
      duration: 5,
      x: '+=360',
      y: '+=200',
      ease: 'power4.inOut',
      repeat: -1,
      yoyo: true,
    })

    tl.to(itemFiveRef.value, {
      duration: 3,
      x: '+=370',
      y: '=360',
      ease: 'power4.inOut',
      repeat: -1,
      yoyo: true,
    })
  }
})
</script>

<template>
  <div class="relative overflow-hidden rounded-t-3xl p-12">
    <div class="absolute inset-0 backdrop-blur-3xl" />
    <div ref="itemOneRef" class="absolute bottom-[50%] left-[50%] -z-[1]">
      <div class="max-h-0 max-w-0">
        <div
          class="bg-brand-gradient aspect-video w-[60vw] rounded-full opacity-40 blur-3xl -translate-x-[50%] -translate-y-[50%]"
        />
      </div>
    </div>
    <div ref="itemTwoRef" class="absolute bottom-[90%] left-[90%] -z-[1]">
      <div class="max-h-0 max-w-0">
        <div
          class="bg-brand-gradient aspect-video w-[30vw] rounded-full opacity-80 blur-3xl -translate-x-[50%] -translate-y-[50%] md:opacity-80"
        />
      </div>
    </div>
    <div ref="itemThreeRef" class="absolute bottom-[10%] left-[0%] -z-[1]">
      <div class="max-h-0 max-w-0">
        <div
          class="aspect-video w-[30vw] rounded-full bg-purple-500 opacity-80 blur-3xl -translate-x-[50%] -translate-y-[50%] md:opacity-90"
        />
      </div>
    </div>
    <div ref="itemFourRef" class="absolute bottom-[25%] right-[0%] -z-[1]">
      <div class="max-h-0 max-w-0">
        <div
          class="aspect-video w-[60vw] rounded-full bg-rose-400 opacity-60 blur-3xl -translate-x-[50%] -translate-y-[50%] md:opacity-40"
        />
      </div>
    </div>
    <div ref="itemFiveRef" class="absolute left-[0%] top-[10%] -z-[1]">
      <div class="max-h-0 max-w-0">
        <div
          class="bg-primary aspect-video w-[60vw] rounded-full opacity-40 blur-3xl -translate-x-[50%] -translate-y-[50%]"
        />
      </div>
    </div>
    <slot />
  </div>
</template>
