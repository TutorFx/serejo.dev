<template>
  <div>
    <Container class="py-12 md:py-24">
      <div class="grid gap-12 md:grid-cols-2">
        <div class="grid gap-6 lg:max-w-md lg:gap-24 md:gap-12">
          <div class="grid gap-1 text-center max-md:justify-center md:text-start">
            <div class="text-neutral-content">
              {{ $t('sections.about_me.accent') }}
            </div>
            <div class="mb-6 text-2xl font-semibold md:text-4xl">
              {{ $t('sections.about_me.title') }}
            </div>
            <div class="max-w-md text-lg md:text-xl">
              {{ $t('me.passion') }}
            </div>
          </div>

          <div class="grid gap-1 text-center max-md:justify-center md:text-start">
            <div class="text-neutral-content">
              {{ $t('sections.stack.accent') }}
            </div>
            <div class="mb-6 text-2xl font-semibold md:text-4xl">
              {{ $t('sections.stack.title') }}
            </div>
            <div class="mb-6 max-w-md text-lg md:text-xl">
              {{ $t('me.stack') }}
            </div>
            <div class="grid grid-cols-4 mb-6 gap-12 max-md:justify-center">
              <div class="aspect-square p-2">
                <NuxtImg class="h-full max-h-full max-w-full w-full" src="/brand/stack/typescript.svg" />
              </div>
              <div class="aspect-square">
                <NuxtImg class="h-full max-h-full max-w-full w-full" src="/brand/stack/tailwind.svg" />
              </div>
              <div class="aspect-square">
                <NuxtImg class="h-full max-h-full max-w-full w-full" src="/brand/stack/nuxt.svg" />
              </div>
              <div class="aspect-square p-2">
                <NuxtImg class="h-full max-h-full max-w-full w-full" src="/brand/stack/vue.svg" />
              </div>
            </div>
            <div class="mb-6 max-w-md text-lg md:text-xl">
              {{ $t('me.legacy') }}
            </div>
          </div>

          <div class="grid gap-1 text-center max-md:justify-center md:text-start">
            <div class="text-neutral-content">
              {{ $t('sections.open_source.accent') }}
            </div>
            <div class="mb-6 text-2xl font-semibold md:text-4xl">
              {{ $t('sections.open_source.title') }}
            </div>
            <div class="max-w-md text-lg md:text-xl">
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
            <div class="grid justify-center">
              <div class="relative aspect-[882/1103] max-w-full overflow-hidden rounded-t-full lg:w-[50dvh]">
                <div class="absolute bottom-0 right-0 grid justify-center">
                  <MeScrollVector class="z-2" />
                </div>
                <NuxtImg width="472" class="w-full rounded-b-3xl" src="/brand/pictures/about.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>
