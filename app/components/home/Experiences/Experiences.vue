<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="relative overflow-hidden rounded-3xl py-24">
    <div class="absolute inset-0 grid">
      <div class="relative">
        <div class="absolute top-[95%] left-[5%] size-64 -translate-[50%] rounded-full bg-[var(--brand-1)] blur-[200px]" />
        <div class="absolute top-[70%] left-[60%] size-32 -translate-[50%] rounded-full bg-[var(--brand-7)] blur-[100px]" />
        <div class="absolute top-[10%] left-[90%] size-128 -translate-[50%] rounded-full bg-[var(--brand-5)] blur-[200px]" />
        <div class="absolute top-[10%] left-[10%] size-64 -translate-[50%] rounded-full bg-[var(--brand-7)] blur-[100px]" />
      </div>
    </div>

    <div class="absolute inset-0 blur-[75px]">
      <div class="bg-base-100 absolute -inset-x-[10vh] -top-[10vh] h-[15vh]" />
      <div class="bg-base-100 absolute -inset-x-[10vh] -bottom-[15vh] h-[15vh]" />
      <div class="bg-base-100 absolute -inset-y-[10vh] -left-[10vh] w-[15vh]" />
      <div class="bg-base-100 absolute -inset-y-[10vh] -right-[10vh] w-[15vh]" />
    </div>

    <UIContainer class="relative">
      <div class="absolute inset-0 grid">
        <div class="relative">
          <AssetsVecLine class="absolute top-[50%] left-[50%] h-[150dvh] w-[150dvw] -translate-x-[50%] -translate-y-[50%] rotate-180 md:h-screen md:w-screen md:scale-[99%]" />
        </div>
      </div>
      <div class="xs:text-4xl relative grid auto-rows-[1fr] justify-center gap-3 text-3xl [text-shadow:_6px_1px_50px_var(--base-100)] sm:text-5xl md:gap-3 md:text-6xl lg:gap-5 lg:text-7xl xl:text-9xl">
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
