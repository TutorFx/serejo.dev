<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: t('menu.projects'),
  meta: [
    { name: 'description', content: t('meta.projects.description') },
    { name: 'keywords', content: t('meta.projects.keywords') },
  ],
})

/* defineOgImage({
  component: 'default',
}) */
</script>

<template>
  <div>
    <div>
      <DynamicHero>
        <Container>
          <div class="grid justify-center items-center min-h-[20rem]">
            <div
              class="relative grid gap-3 text-3xl md:text-6xl lg:text-7xl xl:text-9xl auto-rows-[1fr] md:gap-5 lg:gap-7 [text-shadow:_6px_1px_30px_var(--fallback-b1,oklch(var(--b1)/1))]"
            >
              {{ $t('sections.projects.title') }}
              <div class="bg-base-300 absolute rounded-full -inset-12 z-[-1] blur-xl opacity-90" />
            </div>
          </div>
        </Container>
      </DynamicHero>
      <div class="rounded-b-3xl bg-base-200">
        <Container class="py-6">
          <Projects />
        </Container>
      </div>
    </div>
  </div>
</template>
