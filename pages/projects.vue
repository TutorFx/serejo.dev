<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: t('menu.projects'),
  meta: [
    { name: 'description', content: t('meta.projects.description') },
    { name: 'keywords', content: t('meta.projects.keywords') },
  ],
})

defineOgImage({
  component: 'default',
})
</script>

<template>
  <div>
    <div>
      <DynamicHero>
        <Container>
          <div class="grid min-h-[20rem] items-center justify-center">
            <div
              class="[text-shadow:_6px_1px_30px_var(--fallback-b1,oklch(var(--b1)/1))] relative grid auto-rows-[1fr] gap-3 text-3xl lg:gap-7 md:gap-5 lg:text-7xl md:text-6xl xl:text-9xl"
            >
              {{ $t('sections.projects.title') }}
              <div class="bg-base-300 absolute z-[-1] rounded-full opacity-90 blur-xl -inset-12" />
            </div>
          </div>
        </Container>
      </DynamicHero>
      <div class="bg-base-200 rounded-b-3xl">
        <Container class="py-6">
          <Projects />
        </Container>
      </div>
    </div>
  </div>
</template>
