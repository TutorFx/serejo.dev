<script lang="ts" setup>
import { TransitionPresets, useTransition } from '@vueuse/core'

const { $gsap } = useNuxtApp()

const me = ref(false)
const vue = ref(false)
const config = useRuntimeConfig()
const analytics = useAnalytics()

const itemOneRef = ref<null | HTMLElement>(null)
const itemTwoRef = ref<null | HTMLElement>(null)
const itemThreeRef = ref<null | HTMLElement>(null)
const itemFourRef = ref<null | HTMLElement>(null)
const itemFiveRef = ref<null | HTMLElement>(null)

const starOneRef = ref<null | HTMLElement>(null)
const starTwoRef = ref<null | HTMLElement>(null)
const lineRef = ref()

const lineCompletion = ref(0)

const lineCompletionOutput = useTransition(lineCompletion, {
  duration: 5000,
  transition: TransitionPresets.easeOutExpo,
})

const { stop } = useIntersectionObserver(
  lineRef,
  ([{ isIntersecting }]) => {
    isIntersecting
      ? lineCompletion.value = 100
      : lineCompletion.value = 0
  },
)

onBeforeRouteLeave(() => {
  stop()
})

onMounted(() => {
  lineCompletion.value = 100

  if (import.meta.client) {
    const tl = $gsap.timeline({ repeat: 2, repeatDelay: 1 })

    tl.to(starOneRef.value, { scale: 0.1, repeat: -1, duration: 3, ease: 'power5.inOut', yoyo: true })
      .to(starTwoRef.value, { scale: 0.1, repeat: -1, duration: 3, ease: 'power5.inOut', yoyo: true })

    tl.to(itemOneRef.value, {
      duration: 6,
      x: '+=50',
      y: '+=30',
      ease: 'power4.inOut',
      repeat: -1,
      yoyo: true,
    })

    tl.to(itemTwoRef.value, {
      duration: 9,
      x: '-=90',
      y: '+=60',
      ease: 'power4.inOut',
      repeat: -1,
      yoyo: true,
    })

    tl.to(itemThreeRef.value, {
      duration: 4,
      x: '+=90',
      y: '+=60',
      ease: 'power4.inOut',
      repeat: -1,
      yoyo: true,
    })

    tl.to(itemFourRef.value, {
      duration: 5,
      x: '+=160',
      y: '+=100',
      ease: 'power4.inOut',
      repeat: -1,
      yoyo: true,
    })

    tl.to(itemFiveRef.value, {
      duration: 3,
      x: '+=70',
      y: '+=60',
      ease: 'power4.inOut',
      repeat: -1,
      yoyo: true,
    })
  }
})
</script>

<template>
  <div class="overflow-hidden rounded-t-3xl">
    <div class="relative pt-6">
      <div ref="itemOneRef" class="absolute bottom-[50%] left-[50%] -z-[1]">
        <div class="max-h-0 max-w-0">
          <div
            class="bg-brand-gradient aspect-video w-[60vw] rounded-full opacity-10 blur-3xl -translate-x-[50%] -translate-y-[50%]"
          />
        </div>
      </div>
      <div ref="itemTwoRef" class="absolute bottom-[90%] left-[90%] -z-[1]">
        <div class="max-h-0 max-w-0">
          <div
            class="bg-brand-gradient aspect-video w-[30vw] rounded-full opacity-80 blur-3xl -translate-x-[50%] -translate-y-[50%] md:opacity-30"
          />
        </div>
      </div>
      <div ref="itemThreeRef" class="absolute bottom-[10%] left-[0%] -z-[1]">
        <div class="max-h-0 max-w-0">
          <div
            class="aspect-video w-[30vw] rounded-full bg-rose-500 opacity-80 blur-3xl -translate-x-[50%] -translate-y-[50%] md:opacity-30"
          />
        </div>
      </div>
      <div ref="itemFourRef" class="absolute bottom-[25%] right-[0%] -z-[1]">
        <div class="max-h-0 max-w-0">
          <div
            class="aspect-video w-[60vw] rounded-full bg-rose-400 opacity-20 blur-3xl -translate-x-[50%] -translate-y-[50%] md:opacity-10"
          />
        </div>
      </div>
      <div ref="itemFiveRef" class="absolute left-[0%] top-[10%] -z-[1]">
        <div class="max-h-0 max-w-0">
          <div
            class="bg-primary aspect-video w-[60vw] rounded-full opacity-20 blur-3xl -translate-x-[50%] -translate-y-[50%]"
          />
        </div>
      </div>
      <Container>
        <div class="grid items-center justify-center py-24 lg:py-48 md:py-32">
          <div class="relative">
            <div class="absolute -right-[0%] -top-[10%]">
              <div ref="starOneRef" class="max-h-0 max-w-0">
                <Icon
                  name="Sparkle" size="48"
                  class="size-6 lg:size-10 md:size-8 -translate-x-[50%] -translate-y-[50%]"
                />
              </div>
            </div>
            <div class="absolute left-[50%] -bottom-[20%]">
              <div ref="starTwoRef" class="max-h-0 max-w-0">
                <SparkleOutline
                  name="SparkleOutline" size="48"
                  class="size-6 lg:size-10 md:size-8 -translate-x-[50%] -translate-y-[50%]"
                />
              </div>
            </div>
            <div
              class="[text-shadow:_6px_1px_30px_var(--fallback-b1,oklch(var(--b1)/1))] grid auto-rows-[1fr] gap-3 text-3xl lg:gap-7 md:gap-5 lg:text-7xl md:text-6xl xl:text-9xl"
            >
              <div class="grid items-end leading-none">
                &#123; {{ $t('hero.fl') }}
              </div>
              <div class="grid grid-flow-col items-end gap-6 pl-6 lg:pl-12 md:pl-10">
                <div class="relative grid items-end justify-end -mt-6">
                  <div class="aspect-[192/154] overflow-hidden">
                    <Transition
                      enter-from-class="translate-y-[150%]"
                      enter-active-class="transition duration-500"
                    >
                      <NuxtImg
                        :key="vue ? 'vl' : undefined" placeholder size="176" class="w-16 object-contain p-2 drop-shadow-[20px_5px_10px_var(--fallback-b1,oklch(var(--b1)/.3))] lg:w-32 md:w-24 xl:w-48 lg:p-4 !pb-0"
                        src="/brand/Vue.js.svg"
                        @load="vue = true"
                      />
                    </Transition>
                  </div>
                  <div
                    class="bg-vue-gradient h-6 w-16 rounded-md -z-[1] -mt-[100%] lg:h-12 lg:w-32 md:h-10 md:w-24 xl:h-20 xl:w-48 lg:rounded-xl md:rounded-lg"
                  />
                </div>
                <div class="leading-none">
                  {{ $t('hero.sl') }}
                </div>
              </div>
              <div
                class="grid grid-flow-col items-end justify-start gap-6 pl-3 lg:pl-20 md:pl-16 xl:pl-32"
              >
                <div class="leading-none">
                  {{ $t('hero.tl') }}
                </div>
                <div class="relative grid items-end justify-end -mt-6">
                  <div class="aspect-[128/112] overflow-hidden lg:aspect-[128/112] md:aspect-[192/176]">
                    <Transition
                      enter-from-class="translate-y-[150%]"
                      enter-active-class="transition duration-500"
                    >
                      <NuxtImg
                        :key="me ? 'ml' : undefined" size="176" class="w-16 object-contain p-2 drop-shadow-[20px_5px_10px_var(--fallback-b1,oklch(var(--b1)/.3))] lg:w-32 md:w-24 xl:w-48 lg:p-4 !pb-0"
                        src="/brand/me.png"
                        @load="me = true"
                      />
                    </Transition>
                  </div>
                  <div
                    class="bg-brand-gradient h-6 w-16 rounded-md -z-[1] -mt-[100%] lg:h-12 lg:w-32 md:h-10 md:w-24 xl:h-20 xl:w-48 lg:rounded-xl md:rounded-lg"
                  />
                </div>
                <div>
                  &#125;
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
    <div>
      <Icon
        ref="lineRef"
        name="HeroLine"
        :value="lineCompletionOutput"
        size="100%"
        class="relative z-[-2] h-full w-[90%] -mb-[20%] -mt-20 lg:-mb-[30%] lg:-mt-[20%] md:-mt-[20%]"
      />
      <div class="border-b border-neutral opacity-50" />
      <div class="relative">
        <div class="bg-base-100 absolute inset-x-[-100%] bottom-[-100%] top-0 z-[-2] blur-2xl" />
        <container class="grid gap-3 py-6 font-light md:grid-cols-[1fr_max-content]">
          <div>
            {{ $t('schedule_support_text') }}
          </div>
          <div>
            <Btn v-hoverable:schedule :href="config.public.schedule" target="_blank" @click="analytics.trackSchedule()">
              {{ $t('schedule_cta') }}
            </Btn>
          </div>
        </container>
      </div>
    </div>
  </div>
</template>
