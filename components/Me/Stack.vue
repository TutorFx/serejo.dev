<template>
  <div>
    <Container class="py-12 md:py-24">
      <div class="grid gap-12 md:grid-cols-2">
        <div class="grid gap-6 md:gap-12 lg:gap-24 lg:max-w-md">
          <div class="grid text-center gap-1 max-md:justify-center md:text-start">
            <div class="text-neutral-content">
              {{ $t('sections.about_me.accent') }}
            </div>
            <div class="text-2xl md:text-4xl font-semibold mb-6">
              {{ $t('sections.about_me.title') }}
            </div>
            <div class="text-lg md:text-xl max-w-md">
              {{ $t('me.passion') }}
            </div>
          </div>

          <div class="grid gap-1 text-center max-md:justify-center md:text-start">
            <div class="text-neutral-content">
              {{ $t('sections.stack.accent') }}
            </div>
            <div class="text-2xl md:text-4xl font-semibold mb-6">
              {{ $t('sections.stack.title') }}
            </div>
            <div class="text-lg md:text-xl max-w-md mb-6">
              {{ $t('me.stack') }}
            </div>
            <div class="grid gap-12 max-md:justify-center mb-6 grid-cols-4">
              <div class="p-2 aspect-square">
                <NuxtImg class="w-full max-w-full h-full max-h-full" src="/brand/stack/typescript.svg" />
              </div>
              <div class="aspect-square">
                <NuxtImg class="w-full h-full max-w-full max-h-full" src="/brand/stack/tailwind.svg" />
              </div>
              <div class="aspect-square">
                <NuxtImg class="w-full h-full max-w-full max-h-full" src="/brand/stack/nuxt.svg" />
              </div>
              <div class="aspect-square p-2">
                <NuxtImg class="w-full h-full max-w-full max-h-full" src="/brand/stack/vue.svg" />
              </div>
            </div>
            <div class="text-lg md:text-xl max-w-md mb-6">
              {{ $t('me.legacy') }}
            </div>
          </div>

          <div class="grid gap-1 text-center max-md:justify-center md:text-start">
            <div class="text-neutral-content">
              {{ $t('sections.open_source.accent') }}
            </div>
            <div class="text-2xl md:text-4xl font-semibold mb-6">
              {{ $t('sections.open_source.title') }}
            </div>
            <div class="text-lg md:text-xl max-w-md">
              <span>
                {{ $t('me.open_source') }}
              </span>
              <NuxtLink href="https://github.com/TutorFx" target="_blank" class="text-primary">
                Github
              </NuxtLink>
            </div>
          </div>
        </div>
        <div>
          <div class="sticky top-[20%]">
            <div class="overflow-hidden mx-auto max-w-full rounded-t-full aspect-[882/1103] lg:w-[50dvh]">
              <NuxtImg width="472" class="rounded-b-3xl w-full" src="/brand/pictures/about.png" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>
