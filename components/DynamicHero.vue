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
  <div class="overflow-hidden relative rounded-t-3xl p-12">
    <div class="absolute inset-0 backdrop-blur-3xl" />
    <div ref="itemOneRef" class="absolute -z-[1] left-[50%] bottom-[50%]">
      <div class="max-w-0 max-h-0">
        <div
          class="rounded-full aspect-video -translate-x-[50%] -translate-y-[50%] blur-3xl w-[60vw] bg-brand-gradient opacity-40"
        />
      </div>
    </div>
    <div ref="itemTwoRef" class="-z-[1] absolute left-[90%] bottom-[90%]">
      <div class="max-w-0 max-h-0">
        <div
          class="aspect-video bg-brand-gradient -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl w-[30vw] opacity-80 md:opacity-80"
        />
      </div>
    </div>
    <div ref="itemThreeRef" class="-z-[1] absolute left-[0%] bottom-[10%]">
      <div class="max-w-0 max-h-0">
        <div
          class="w-[30vw] aspect-video -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-80 bg-purple-500 md:opacity-90"
        />
      </div>
    </div>
    <div ref="itemFourRef" class="-z-[1] absolute right-[0%] bottom-[25%]">
      <div class="max-w-0 max-h-0">
        <div
          class="w-[60vw] aspect-video -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl bg-rose-400 opacity-60 md:opacity-40"
        />
      </div>
    </div>
    <div ref="itemFiveRef" class="-z-[1] absolute left-[0%] top-[10%]">
      <div class="max-w-0 max-h-0">
        <div
          class="w-[60vw] aspect-video -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-40 bg-primary"
        />
      </div>
    </div>
    <slot />
  </div>
</template>
