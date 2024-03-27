<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: t('menu.projects'),
})
</script>

<template>
  <div>
    <div>
      <DynamicHero class="[view-transition-name:hero]">
        <Container>
          <div class="grid justify-center items-center min-h-[40dvh]">
            <div
              class="relative grid gap-3 text-3xl md:text-6xl lg:text-7xl xl:text-9xl auto-rows-[1fr] md:gap-5 lg:gap-7 [text-shadow:_6px_1px_30px_var(--fallback-b1,oklch(var(--b1)/1))]"
            >
              {{ $t('sections.projects.title') }}
              <div class="bg-base-300 absolute rounded-full -inset-12 z-[-1] blur-xl opacity-90" />
            </div>
          </div>
        </Container>
        <div class="absolute inset-0 grid items-center justify-center max-w-screen -z-[2] pointer-events-none rotate-180">
          <div class="relative max-h-0 max-w-0 -rotate-[12deg]">
            <Icon
              name="HeroLine"
              class="absolute -translate-y-[50%] -translate-x-[50%] rotate-5 w-[100dvw] h-[100dvh] scale-[99%] md:scale-[100%]"
              size="100%"
            />
          </div>
        </div>
      </DynamicHero>
      <div class="bg-base-200 rounded-b-3xl">
        <Container>
          <Projects />
        </Container>
      </div>
    </div>
  </div>
</template>
