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
    <div class="relative grid h-[550px] grid-rows-[1fr_max-content] items-center overflow-hidden rounded-3xl sm:h-[calc(100dvh-96px)]">
      <div class="relative h-full">
        <div class="absolute inset-0 grid">
          <div class="relative">
            <div class="absolute top-[95%] left-[5%] size-42 -translate-[50%] rounded-full bg-[var(--brand-1)] blur-[100px]" />
            <div class="absolute top-[70%] left-[60%] size-32 -translate-[50%] rounded-full bg-[var(--brand-7)] blur-[100px]" />
            <div class="absolute top-[80%] left-[90%] size-42 -translate-[50%] rounded-full bg-[var(--brand-10)] blur-[100px]" />
            <div class="absolute top-[10%] left-[10%] size-64 -translate-[50%] rounded-full bg-[var(--brand-7)] blur-[100px]" />

            <div class="absolute top-[10%] left-[90%] size-128 -translate-[50%] rounded-full bg-[var(--brand-5)] blur-[100px]" />
          </div>
        </div>
        <AssetsVecLine class="absolute -bottom-[10vw] w-[100vw] md:-bottom-[30vw]" />
        <div class="absolute inset-0 blur-[75px]">
          <div class="bg-base-100 absolute inset-x-[-10vh] top-[-10vh] h-[15vh]" />
          <div class="bg-base-100 absolute inset-x-[-10vh] bottom-[-15vh] h-[15vh]" />
          <div class="bg-base-100 absolute inset-y-[-10vh] left-[-10vh] w-[15vh]" />
          <div class="bg-base-100 absolute inset-y-[-10vh] right-[-10vh] w-[15vh]" />
        </div>
        <div class="relative z-10 grid h-full items-center">
          <HeroText />
        </div>
      </div>
      <div class="relative">
        <div class="bg-base-100 absolute inset-0 -inset-x-[100%] top-0 h-[200%] blur-3xl" />
        <div class="bg-base-100 absolute inset-0 -inset-x-[100%] top-[10%] h-[200%] blur-3xl" />
        <div class="bg-base-100 absolute inset-0 -inset-x-[100%] top-[20%] h-[200%] blur-3xl" />
        <div class="border-base-300 relative border-t" />
        <UIContainer class="relative grid justify-between gap-3 p-6 md:grid-flow-col">
          <div>
            {{ t('SCHEDULE_support_text') }}
          </div>
          <div class="grid items-center justify-start">
            <UIButton :to="SCHEDULE">
              {{ t('SCHEDULE_cta') }}
            </UIButton>
          </div>
        </UIContainer>
      </div>
    </div>
  </div>
</template>
