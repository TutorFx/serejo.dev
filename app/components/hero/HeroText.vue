<script setup lang="ts">
import { useIntervalFn, usePreferredReducedMotion } from '@vueuse/core'

const { t } = useI18n()

/**
 * Logos that take turns in the tile of the second line; the strip behind them takes the colour of the current one.
 * The order keeps two strips of the same hue apart (half of these brands are blue).
 */
const STACK = [
  { name: 'TypeScript', src: '/brand/stack/typescript.svg', color: '#3178c6', mono: false },
  { name: 'Python', src: '/brand/stack/python.svg', color: '#ffd43b', mono: false },
  { name: 'Docker', src: '/brand/stack/docker.svg', color: '#2396ed', mono: false },
  { name: 'AWS', src: '/brand/stack/aws.svg', color: '#ff9900', mono: true },
  { name: 'Kubernetes', src: '/brand/stack/kubernetes.svg', color: '#326de6', mono: false },
  { name: 'LangChain', src: '/brand/stack/langchain.svg', color: '#1c8c7c', mono: true },
  { name: 'Azure', src: '/brand/stack/azure.svg', color: '#0078d4', mono: false },
  { name: 'Google ADK', src: '/brand/stack/google-adk.png', color: '#34a853', mono: false },
  { name: 'Google Cloud', src: '/brand/stack/gcp.svg', color: '#ea4335', mono: false },
  { name: 'Terraform', src: '/brand/stack/terraform.svg', color: '#5c4ee5', mono: false },
] as const

const ROTATE_MS = 2500

const active = ref(0)
const activeColor = computed(() => STACK[active.value]?.color)
const reducedMotion = usePreferredReducedMotion()

useIntervalFn(() => {
  if (reducedMotion.value === 'reduce') return

  active.value = (active.value + 1) % STACK.length
}, ROTATE_MS)
</script>

<template>
  <div>
    <div class="xs:max-w-4xl relative mx-auto max-w-xl md:max-w-4xl lg:max-w-3xl xl:max-w-7xl">
      <div
        class="xs:text-4xl grid auto-rows-[1fr] justify-center gap-3 text-3xl [text-shadow:_6px_1px_50px_var(--base-100)] sm:text-5xl md:gap-3 md:text-6xl lg:gap-5 lg:text-7xl xl:text-9xl [&_>_div]:max-h-12 md:[&_>_div]:max-h-18 lg:[&_>_div]:max-h-24 xl:[&_>_div]:max-h-32"
      >
        <div class="grid items-end leading-none">&#123; {{ t('hero.fl') }}</div>
        <div class="grid grid-flow-col items-end justify-center gap-6">
          <div
            aria-hidden="true"
            class="relative grid aspect-square items-end overflow-hidden rounded-xl lg:rounded-3xl"
          >
            <div
              class="absolute inset-x-0 bottom-0 aspect-[208/96] overflow-hidden rounded-xl bg-[linear-gradient(45deg,rgb(0_0_0/0.2),rgb(255_255_255/0.3))] transition-colors duration-700 lg:rounded-3xl"
              :style="{ backgroundColor: activeColor }"
            >
              <!--
                A copy of the logos in the same place as the ones below (inset-x-4 mirrors their p-4). Only its shadow
                shows, and the strip cuts it, so the shadow falls on the coloured card and never on the page
              -->
              <HeroStackLogos shadow :logos="STACK" :active class="absolute inset-x-4 bottom-0" />
            </div>
            <div class="p-4 pb-0">
              <HeroStackLogos
                :logos="STACK"
                :active
                class="relative w-16 md:w-24 lg:w-32 xl:w-36"
              />
            </div>
          </div>
          <div class="leading-none">
            {{ t('hero.sl') }}
          </div>
        </div>
        <div
          class="grid grid-flow-col items-end justify-start gap-6 pl-3 md:pl-16 lg:pl-20 xl:pl-32"
        >
          <div class="leading-none">
            {{ t('hero.tl') }}
          </div>
          <div class="relative overflow-hidden rounded-xl lg:rounded-3xl">
            <div
              class="bg-brand absolute inset-x-0 bottom-0 aspect-[208/96] rounded-xl lg:rounded-3xl"
            />
            <div class="p-4 pb-0">
              <div class="relative aspect-square w-16 md:w-24 lg:w-32 xl:w-44">
                <Transition
                  enter-from-class="translate-y-[150%]"
                  enter-active-class="transition duration-500"
                >
                  <NuxtImg
                    size="176"
                    class="relative w-16 drop-shadow-[20px_5px_10px_var(--fallback-b1,oklch(var(--b1)/.3))] md:w-24 lg:w-32 xl:w-44"
                    src="/brand/me.png"
                  />
                </Transition>
              </div>
            </div>
          </div>
          <div>&#125;</div>
        </div>
      </div>
    </div>
  </div>
</template>
