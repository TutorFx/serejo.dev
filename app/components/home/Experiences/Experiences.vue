<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="relative py-24 rounded-3xl overflow-hidden">
    <div class="absolute inset-0 grid">
      <div class="relative">
        <div ref="gradient-1" class="absolute top-[95%] left-[5%] rounded-full size-64 bg-[var(--brand-1)] -translate-[50%] blur-[200px]" />
        <div ref="gradient-2" class="absolute top-[70%] left-[60%] rounded-full size-32 bg-[var(--brand-7)] -translate-[50%] blur-[100px]" />
        <div ref="gradient-3" class="absolute top-[10%] left-[90%] rounded-full size-128 bg-[var(--brand-5)] -translate-[50%] blur-[200px]" />
        <div ref="gradient-4" class="absolute top-[10%] left-[10%] rounded-full size-64 bg-[var(--brand-7)] -translate-[50%] blur-[100px]" />
      </div>
    </div>

    <div class="absolute inset-0 blur-[75px]">
      <div class="absolute -inset-x-[10vh] -top-[10vh] h-[15vh] bg-base-100" />
      <div class="absolute -inset-x-[10vh] -bottom-[15vh] h-[15vh] bg-base-100" />
      <div class="absolute -inset-y-[10vh] -left-[10vh] w-[15vh] bg-base-100" />
      <div class="absolute -inset-y-[10vh] -right-[10vh] w-[15vh] bg-base-100" />
    </div>

    <UIContainer class="relative">
      <div class="absolute inset-0 grid">
        <div class="relative">
          <AssetsVecLine class="top-[50%] left-[50%] absolute -translate-y-[50%] -translate-x-[50%] md:scale-[99%] rotate-180 w-[150dvw] h-[150dvh] md:w-screen md:h-screen" />
        </div>
      </div>
      <div class="relative grid gap-3 md:gap-3 lg:gap-5 justify-center text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl auto-rows-[1fr] [text-shadow:_6px_1px_50px_var(--base-100)]">
        <div class="py-32">
          &#123;{{ t('sections.experiences.title') }}&#125;
        </div>
      </div>
    </UIContainer>

    <UIContainer class="relative">
      <CmsExperienceCardList />
    </UIContainer>
  </div>
</template>