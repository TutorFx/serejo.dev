<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div>
    <div class="xs:max-w-4xl relative mx-auto max-w-xl md:max-w-4xl lg:max-w-3xl xl:max-w-7xl">
      <div
        class="xs:text-4xl grid auto-rows-[1fr] justify-center gap-3 text-3xl [text-shadow:_6px_1px_50px_var(--base-100)] sm:text-5xl md:gap-3 md:text-6xl lg:gap-5 lg:text-7xl xl:text-9xl [&_>_div]:max-h-12 md:[&_>_div]:max-h-18 lg:[&_>_div]:max-h-24 xl:[&_>_div]:max-h-32"
      >
        <div class="grid items-end leading-none">
          &#123; {{ t('hero.fl') }}
        </div>
        <div class="grid grid-flow-col items-end justify-center gap-6">
          <div class="relative grid aspect-square items-end overflow-hidden rounded-xl lg:rounded-3xl">
            <div class="bg-vue absolute inset-x-0 bottom-0 aspect-[208/96] rounded-xl lg:rounded-3xl" />
            <div class="p-4 pb-0">
              <div class="relative aspect-[192/166.27]">
                <Transition enter-from-class="translate-y-[150%]" enter-active-class="transition duration-500">
                  <NuxtImg
                    placeholder
                    size="176"
                    class="w-16 drop-shadow-[20px_5px_10px_var(--fallback-b1,oklch(var(--b1)/.3))] md:w-24 lg:w-32 xl:w-36"
                    src="/brand/Vue.js.svg"
                  />
                </Transition>
              </div>
            </div>
          </div>
          <div class="leading-none">
            {{ t('hero.sl') }}
          </div>
        </div>
        <div class="grid grid-flow-col items-end justify-start gap-6 pl-3 md:pl-16 lg:pl-20 xl:pl-32">
          <div class="leading-none">
            {{ t('hero.tl') }}
          </div>
          <div class="relative overflow-hidden rounded-xl lg:rounded-3xl">
            <div class="bg-brand absolute inset-x-0 bottom-0 aspect-[208/96] rounded-xl lg:rounded-3xl" />
            <div class="p-4 pb-0">
              <div class="relative aspect-square w-16 md:w-24 lg:w-32 xl:w-44">
                <Transition enter-from-class="translate-y-[150%]" enter-active-class="transition duration-500">
                  <NuxtImg
                    size="176"
                    class="relative w-16 drop-shadow-[20px_5px_10px_var(--fallback-b1,oklch(var(--b1)/.3))] md:w-24 lg:w-32 xl:w-44"
                    src="/brand/me.png"
                  />
                </Transition>
              </div>
            </div>
          </div>
          <div>
            &#125;
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
