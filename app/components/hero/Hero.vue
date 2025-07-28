<script setup lang="ts">
import { gsap } from 'gsap'

const { t } = useI18n()

useGsap(() => {
  const tl = gsap.timeline()

  tl.restart()
})
</script>

<template>
  <div>
    <div class="h-[550px] sm:h-[calc(100dvh-96px)] grid-rows-[1fr_max-content] grid items-center relative overflow-hidden rounded-3xl">
      <div class="relative h-full">
        <div class="absolute inset-0 grid">
          <div class="relative">
            <div class="absolute top-[95%] left-[5%] rounded-full size-42 bg-[var(--brand-1)] -translate-[50%] blur-[100px]" />
            <div class="absolute top-[70%] left-[60%] rounded-full size-32 bg-[var(--brand-7)] -translate-[50%] blur-[100px]" />
            <div class="absolute top-[80%] left-[90%] rounded-full size-42 bg-[var(--brand-10)] -translate-[50%] blur-[100px]" />
            <div class="absolute top-[10%] left-[10%] rounded-full size-64 bg-[var(--brand-7)] -translate-[50%] blur-[100px]" />

            <div class="absolute top-[10%] left-[90%] rounded-full size-128 bg-[var(--brand-5)] -translate-[50%] blur-[100px]" />
          </div>
        </div>
        <AssetsVecLine class="w-[100vw] absolute -bottom-[10vw] md:-bottom-[30vw]" />
        <div class="absolute inset-0 blur-[75px]">
          <div class="absolute -inset-x-[10vh] -top-[10vh] h-[15vh] bg-base-100" />
          <div class="absolute -inset-x-[10vh] -bottom-[15vh] h-[15vh] bg-base-100" />
          <div class="absolute -inset-y-[10vh] -left-[10vh] w-[15vh] bg-base-100" />
          <div class="absolute -inset-y-[10vh] -right-[10vh] w-[15vh] bg-base-100" />
        </div>
        <div class="grid h-full items-center relative z-10">
          <HeroText />
        </div>
      </div>
      <div class="relative">
        <div class="absolute inset-0 -inset-x-[100%] top-0 h-[200%] bg-base-100 blur-3xl" />
        <div class="absolute inset-0 -inset-x-[100%] top-[10%] h-[200%] bg-base-100 blur-3xl" />
        <div class="absolute inset-0 -inset-x-[100%] top-[20%] h-[200%] bg-base-100 blur-3xl" />
        <div class="relative border-t border-base-300" />
        <UIContainer class="relative p-6 grid gap-3 md:grid-flow-col justify-between">
          <div>
            {{ t('SCHEDULE_support_text') }}
          </div>
          <div class="grid justify-start items-center">
            <UIButton :to="SCHEDULE">
              {{ t('SCHEDULE_cta') }}
            </UIButton>
          </div>
        </UIContainer>
      </div>
    </div>
  </div>
</template>
