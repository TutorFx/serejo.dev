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
  ([entry]) => {
    const isIntersecting = entry?.isIntersecting ?? false
    if (isIntersecting) {
      lineCompletion.value = 100
    }
    else {
      lineCompletion.value = 0
    }
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
      <div ref="itemOneRef" class="-z-[1] absolute left-[50%] bottom-[50%]">
        <div class="max-w-0 max-h-0">
          <div
            class="rounded-full w-[60vw] aspect-video bg-brand-gradient -translate-x-[50%] -translate-y-[50%] blur-3xl opacity-10"
          />
        </div>
      </div>
      <div ref="itemTwoRef" class="-z-[1] absolute left-[90%] bottom-[90%]">
        <div class="max-w-0 max-h-0">
          <div
            class="aspect-video bg-brand-gradient -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl w-[30vw] opacity-80 md:opacity-30"
          />
        </div>
      </div>
      <div ref="itemThreeRef" class="-z-[1] absolute left-[0%] bottom-[10%]">
        <div class="max-w-0 max-h-0">
          <div
            class="w-[30vw] aspect-video -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-80 md:opacity-30 bg-rose-500"
          />
        </div>
      </div>
      <div ref="itemFourRef" class="-z-[1] absolute right-[0%] bottom-[25%]">
        <div class="max-w-0 max-h-0">
          <div
            class="w-[60vw] aspect-video -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl bg-rose-400 opacity-20 md:opacity-10"
          />
        </div>
      </div>
      <div ref="itemFiveRef" class="-z-[1] absolute left-[0%] top-[10%]">
        <div class="max-w-0 max-h-0">
          <div
            class="w-[60vw] aspect-video -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-20 bg-primary"
          />
        </div>
      </div>
      <Container>
        <div class="grid items-center justify-center py-24 md:py-32 lg:py-48">
          <div class="relative">
            <div class="absolute -right-[0%] -top-[10%]">
              <div ref="starOneRef" class="max-w-0 max-h-0">
                <Icon
                  name="Sparkle" size="48"
                  class="-translate-x-[50%] -translate-y-[50%] size-6 md:size-8 lg:size-10"
                />
              </div>
            </div>
            <div class="absolute left-[50%] -bottom-[20%]">
              <div ref="starTwoRef" class="max-w-0 max-h-0">
                <SparkleOutline
                  name="SparkleOutline" size="48"
                  class="size-6 md:size-8 lg:size-10 -translate-x-[50%] -translate-y-[50%]"
                />
              </div>
            </div>
            <div
              class="grid gap-3 text-3xl md:text-6xl lg:text-7xl xl:text-9xl auto-rows-[1fr] md:gap-5 lg:gap-7 [text-shadow:_6px_1px_30px_var(--fallback-b1,oklch(var(--b1)/1))]"
            >
              <div class="grid items-end leading-none">
                &#123; {{ $t('hero.fl') }}
              </div>
              <div class="grid items-end grid-flow-col gap-6 pl-6 md:pl-10 lg:pl-12">
                <div class="grid items-end relative justify-end -mt-6">
                  <div class="overflow-hidden aspect-[192/154]">
                    <Transition
                      enter-from-class="translate-y-[150%]"
                      enter-active-class="transition duration-500"
                    >
                      <NuxtImg
                        :key="vue ? 'vl' : undefined" placeholder size="176" class="object-contain p-2 lg:p-4 !pb-0 w-16 md:w-24 lg:w-32 xl:w-48 drop-shadow-[20px_5px_10px_var(--fallback-b1,oklch(var(--b1)/.3))]"
                        src="/brand/Vue.js.svg"
                        @load="vue = true"
                      />
                    </Transition>
                  </div>
                  <div
                    class="-z-[1] w-16 md:w-24 lg:w-32 xl:w-48 h-6 rounded-md bg-vue-gradient md:h-10 lg:h-12 xl:h-20 -mt-[100%] md:rounded-lg lg:rounded-xl"
                  />
                </div>
                <div class="leading-none">
                  {{ $t('hero.sl') }}
                </div>
              </div>
              <div
                class="grid grid-flow-col items-end gap-6 justify-start pl-3 md:pl-16 lg:pl-20 xl:pl-32"
              >
                <div class="leading-none">
                  {{ $t('hero.tl') }}
                </div>
                <div class="grid items-end justify-end relative -mt-6">
                  <div class="overflow-hidden aspect-[128/112] md:aspect-[192/176] lg:aspect-[128/112]">
                    <Transition
                      enter-from-class="translate-y-[150%]"
                      enter-active-class="transition duration-500"
                    >
                      <NuxtImg
                        :key="me ? 'ml' : undefined" size="176" class="object-contain p-2 lg:p-4 !pb-0 w-16 md:w-24 lg:w-32 xl:w-48 drop-shadow-[20px_5px_10px_var(--fallback-b1,oklch(var(--b1)/.3))]"
                        src="/brand/me.png"
                        @load="me = true"
                      />
                    </Transition>
                  </div>
                  <div
                    class="-z-[1] h-6 md:h-10 lg:h-12 xl:h-20 -mt-[100%] w-16 md:w-24 lg:w-32 xl:w-48 rounded-md md:rounded-lg lg:rounded-xl bg-brand-gradient"
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
        class="relative z-[-2] -mt-20 -mb-[20%] md:-mt-[20%] lg:-mt-[20%] lg:-mb-[30%] w-[90%] h-full"
      />
      <div class="border-b border-neutral opacity-50" />
      <div class="relative">
        <div class="absolute z-[-2] bg-base-100 top-0 inset-x-[-100%] blur-2xl bottom-[-100%]" />
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
