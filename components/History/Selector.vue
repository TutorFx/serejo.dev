<script lang="ts" setup>
import { TransitionPresets } from '@vueuse/core'
import HistoryService from '~/utils/cms/history/HistoryService'
import HistoryController from '~/utils/cms/history/HistoryController'

const { $gsap } = useNuxtApp()

const history = getHistory()
const service = computed(() => history.data.value && getHistoryService(history.data.value))

const current = ref()
const lineRef = ref()
const lineCompletion = ref(0)

const itemOneRef = ref<null | HTMLElement>(null)
const itemTwoRef = ref<null | HTMLElement>(null)
const itemThreeRef = ref<null | HTMLElement>(null)
const itemFourRef = ref<null | HTMLElement>(null)
const itemFiveRef = ref<null | HTMLElement>(null)

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
      x: '+=90',
      y: '+=60',
      ease: 'power4.inOut',
      repeat: -1,
      yoyo: true,
    })

    tl.to(itemFourRef.value, {
      duration: 5,
      x: '+=160',
      y: '+=200',
      ease: 'power4.inOut',
      repeat: -1,
      yoyo: true,
    })

    tl.to(itemFiveRef.value, {
      duration: 3,
      x: '+=70',
      y: '+=360',
      ease: 'power4.inOut',
      repeat: -1,
      yoyo: true,
    })
  }
})
</script>

<template>
  <div class="relative grid overflow-hidden rounded-3xl pb-12 md:pb-24">
    <div ref="itemOneRef" class="absolute left-[0%] top-[0%] -z-[1]">
      <div class="max-h-0 max-w-0">
        <div
          class="bg-brand-gradient aspect-video w-[30vw] rounded-full opacity-80 blur-3xl -translate-x-[50%] -translate-y-[50%] md:opacity-30"
        />
      </div>
    </div>
    <div ref="itemTwoRef" class="absolute left-[90%] top-[0%] -z-[1]">
      <div class="max-h-0 max-w-0">
        <div
          class="bg-primary aspect-video w-[30vw] rounded-full opacity-80 blur-3xl -translate-x-[50%] -translate-y-[50%] md:opacity-30"
        />
      </div>
    </div>
    <div ref="itemThreeRef" class="absolute bottom-[0%] left-[90%] -z-[1]">
      <div class="max-h-0 max-w-0">
        <div
          class="bg-primary aspect-video w-[30vw] rounded-full opacity-80 blur-3xl -translate-x-[50%] -translate-y-[50%] md:opacity-30"
        />
      </div>
    </div>
    <div ref="itemFourRef" class="absolute bottom-[0%] left-[0%] -z-[1]">
      <div class="max-h-0 max-w-0">
        <div
          class="bg-brand-gradient aspect-video w-[30vw] rounded-full opacity-80 blur-3xl -translate-x-[50%] -translate-y-[50%] md:opacity-30"
        />
      </div>
    </div>
    <div>
      <div class="relative z-[2] py-24 md:py-48 xl:py-56">
        <div ref="itemFiveRef" class="absolute bottom-[-10%] left-[10%] z-[1]">
          <div class="max-h-0 max-w-0">
            <div
              class="aspect-video w-[30vw] rounded-full bg-rose-400 opacity-50 blur-[164px] -translate-x-[50%] -translate-y-[50%] md:opacity-30"
            />
          </div>
        </div>
        <div class="absolute bottom-[-30%] left-[40%] z-[1]">
          <div class="max-h-0 max-w-0">
            <div
              class="bg-primary aspect-video w-[30vw] rounded-full opacity-50 blur-3xl -translate-x-[50%] -translate-y-[50%] md:opacity-30"
            />
          </div>
        </div>
        <div
          class="text-center text-3xl drop-shadow-[0px_0px_20px_var(--fallback-b1,oklch(var(--b1)/1))] lg:text-7xl md:text-6xl xl:text-9xl"
        >
          <div class="grid grid-flow-col items-center justify-center gap-3">
            <div class="relative">
              <div class="bg-base-100 absolute inset-0 z-[-1] opacity-45 blur-xl" />
              <span>&#123;</span> {{ $t('sections.experiences.title') }} <span>&#125;</span>
            </div>
          </div>
        </div>
        <div class="pointer-events-none relative grid max-w-screen items-center justify-center -z-[2]">
          <div class="relative max-h-0 max-w-0 -rotate-[12deg]">
            <Icon
              ref="lineRef"
              :value="lineCompletionOutput"
              name="HeroLine"
              class="absolute h-screen w-screen rotate-180 scale-[99%] -translate-x-[50%] -translate-y-[50%]"
              size="100%"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="service && (service instanceof HistoryService)"
      class="relative z-[2] grid grid-cols-1 gap-6 md:gap-12"
    >
      <div>
        <div>
          <Container>
            <ClientOnly>
              <HistorySelectorRepositorySlider
                :repository="service.repository"
                class="drop-shadow-[0px_0px_60px_var(--fallback-b1,oklch(var(--b1)/1))]"
                @change="(e) => current = e"
              />

              <template #fallback>
                <div
                  class="grid gap-16 drop-shadow-[0px_0px_20px_var(--fallback-b1,oklch(var(--b1)/1))] md:grid-cols-3"
                >
                  <div class="max-md:hidden" />
                  <div class="bg-brand-gradient aspect-video rounded-md" />
                  <div class="bg-base-300 aspect-video rounded-md bg-opacity-50 max-md:hidden" />
                </div>
              </template>
            </ClientOnly>
          </Container>
        </div>
      </div>

      <div class="text-primary text-center">
        <Icon size="48" name="material-symbols:arrow-cool-down-rounded" />
      </div>

      <div>
        <Container v-if="current && (current instanceof HistoryController)">
          <Transition
            enter-from-class="-translate-x-[150%]" leave-to-class="-translate-x-[50%]"
            enter-active-class="transition duration-500"
          >
            <div
              :key="current._id"
              class="z-[1] drop-shadow-[0px_0px_60px_var(--fallback-b1,oklch(var(--b1)/1))]"
            >
              <div class="bg-base-100 rounded-md px-3 py-6 md:px-12 md:py-24">
                <div class="grid grid-cols-1 gap-6">
                  <div class="grid justify-start md:grid-cols-[1fr_,max-content]">
                    <div class="text-primary">
                      {{ current.location }}
                    </div>
                    <div class="grid grid-flow-col items-center justify-start gap-1">
                      <Icon name="solar:calendar-bold-duotone" />
                      <div class="text-neutral">
                        {{ current.getDateToLocaleString(useLocale()).join(` ● `) }}
                      </div>
                    </div>
                  </div>
                  <div class="text-4xl font-bold">
                    {{ $t('description') }}
                  </div>
                  <ContentRenderer class="prose-md max-w-none text-pretty text-lg prose md:text-xl" :value="current" />
                </div>
              </div>
            </div>
          </Transition>
        </Container>

        <Container v-else>
          <div class="bg-base-100 rounded-md px-3 py-6 md:px-12 md:py-24">
            Loading...
          </div>
        </Container>
      </div>
    </div>
  </div>
</template>
