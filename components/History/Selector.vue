<script lang="ts" setup>
import { TransitionPresets } from '@vueuse/core';
import HistoryService from '~/utils/cms/history/HistoryService'
import HistoryController from '~/utils/cms/history/HistoryController'

const history = getHistory()
const service = computed(() => history.data.value && getHistoryService(history.data.value))

const current = ref()
const lineRef = ref()
const lineCompletion = ref(0)

const lineCompletionOutput = useTransition(lineCompletion, {
  duration: 5000,
  transition: TransitionPresets.easeOutExpo,
})

useIntersectionObserver(
  lineRef,
  ([{ isIntersecting }]) => {
    isIntersecting ? 
      lineCompletion.value = 100 : 
      lineCompletion.value = 0
  },
)
</script>

<template>
  <div class="grid overflow-hidden relative rounded-3xl pb-12 md:pb-24">
    <div class="-z-[1] absolute left-[0%] top-[0%]">
      <div class="max-w-0 max-h-0">
        <div
          class="w-[30vw] aspect-video bg-brand-gradient -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-80 md:opacity-30"
        />
      </div>
    </div>
    <div class="-z-[1] absolute left-[90%] top-[0%]">
      <div class="max-w-0 max-h-0">
        <div
          class="w-[30vw] aspect-video bg-primary -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-80 md:opacity-30"
        />
      </div>
    </div>
    <div class="-z-[1] absolute left-[90%] bottom-[0%]">
      <div class="max-w-0 max-h-0">
        <div
          class="w-[30vw] aspect-video bg-primary -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-80 md:opacity-30"
        />
      </div>
    </div>
    <div class="-z-[1] absolute left-[0%] bottom-[0%]">
      <div class="max-w-0 max-h-0">
        <div
          class="w-[30vw] aspect-video bg-brand-gradient -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-80 md:opacity-30"
        />
      </div>
    </div>
    <div>
      <div class="relative py-24 z-[2] md:py-48 xl:py-56">
        <div class="absolute left-[10%] z-[1] bottom-[-10%]">
          <div class="max-w-0 max-h-0">
            <div
              class="w-[30vw] aspect-video bg-rose-400 -translate-x-[50%] -translate-y-[50%] rounded-full opacity-50 md:opacity-30 blur-[164px]"
            />
          </div>
        </div>
        <div class="z-[1] absolute left-[40%] bottom-[-30%]">
          <div class="max-w-0 max-h-0">
            <div
              class="w-[30vw] aspect-video bg-primary -translate-x-[50%] -translate-y-[50%] rounded-full blur-3xl opacity-50 md:opacity-30"
            />
          </div>
        </div>
        <div
          class="text-3xl md:text-6xl lg:text-7xl xl:text-9xl text-center drop-shadow-[0px_0px_20px_var(--fallback-b1,oklch(var(--b1)/1))]"
        >
          <div class="grid grid-flow-col items-center justify-center gap-3">
            <div class="relative">
              <div class="absolute inset-0 bg-base-100 z-[-1] blur-xl opacity-45" />
              <span>&#123;</span> {{ $t('sections.experiences.title') }} <span>&#125;</span>
            </div>
          </div>
        </div>
        <div class="relative grid items-center justify-center max-w-screen -z-[2] pointer-events-none">
          <div class="relative max-h-0 max-w-0 -rotate-[12deg]">
            <Icon
              ref="lineRef"
              :value="lineCompletionOutput"
              name="HeroLine"
              class="absolute -translate-y-[50%] -translate-x-[50%] scale-[99%] rotate-180 w-screen h-screen"
              size="100%"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="service && (service instanceof HistoryService)"
      class="grid grid-cols-1 gap-6 relative z-[2] md:gap-12"
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
                  class="grid drop-shadow-[0px_0px_20px_var(--fallback-b1,oklch(var(--b1)/1))] md:grid-cols-3 gap-16"
                >
                  <div class="max-md:hidden" />
                  <div class="aspect-video bg-brand-gradient rounded-md" />
                  <div class="max-md:hidden aspect-video bg-base-300 rounded-md bg-opacity-50" />
                </div>
              </template>
            </ClientOnly>
          </Container>
        </div>
      </div>

      <div class="text-center text-primary">
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
              <div class="py-6 px-3 bg-base-100 rounded-md md:py-24 md:px-12">
                <div class="grid grid-cols-1 gap-6">
                  <div class="grid justify-start md:grid-cols-[1fr_,max-content]">
                    <div class="text-primary">
                      {{ current.location }}
                    </div>
                    <div class="grid grid-flow-col justify-start items-center gap-1">
                      <Icon name="solar:calendar-bold-duotone" />
                      <div class="text-neutral">
                        {{ current.getDateToLocaleString(useLocale()).join(` ● `) }}
                      </div>
                    </div>
                  </div>
                  <div class="font-bold text-4xl">
                    {{ $t('description') }}
                  </div>
                  <ContentRenderer class="text-lg prose prose-md max-w-none md:text-xl text-pretty" :value="current" />
                </div>
              </div>
            </div>
          </Transition>
        </Container>

        <Container v-else>
          <div class="py-6 px-3 md:px-12 md:py-24 rounded-md bg-base-100">
            Loading...
          </div>
        </Container>
      </div>
    </div>
  </div>
</template>
