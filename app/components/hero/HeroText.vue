<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div>
    <div class="relative max-w-xl xs:max-w-4xl md:max-w-4xl lg:max-w-3xl xl:max-w-7xl mx-auto">
      <div
        class="grid gap-3 md:gap-3 lg:gap-5 justify-center text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl auto-rows-[1fr] [text-shadow:_6px_1px_50px_var(--base-100)] [&_>_div]:max-h-12 md:[&_>_div]:max-h-18 lg:[&_>_div]:max-h-24 xl:[&_>_div]:max-h-32">
        <div class="grid items-end leading-none">
          &#123; {{ t('hero.fl') }}
        </div>
        <div class="grid grid-flow-col gap-6 justify-center items-end">
          <div class="relative aspect-square rounded-xl lg:rounded-3xl overflow-hidden grid items-end">
            <div class="absolute aspect-[208/96] inset-x-0 bottom-0 bg-vue rounded-xl lg:rounded-3xl" />
            <div class="pb-0 p-4">
              <div class="relative aspect-[192/166.27]">
                <Transition enter-from-class="translate-y-[150%]" enter-active-class="transition duration-500">
                    <NuxtImg placeholder size="176"
                      class="w-16 md:w-24 lg:w-32 xl:w-36 drop-shadow-[20px_5px_10px_var(--fallback-b1,oklch(var(--b1)/.3))]"
                      src="/brand/Vue.js.svg" />
                  </Transition>
              </div>
            </div>
          </div>
          <div class="leading-none">
            {{ t('hero.sl') }}
          </div>
        </div>
        <div class="grid grid-flow-col items-end gap-6 justify-start pl-3 md:pl-16 lg:pl-20 xl:pl-32">
          <div class="leading-none">
            {{ t('hero.tl') }}
          </div>
          <div class="relative rounded-xl lg:rounded-3xl overflow-hidden">
            <div class="absolute aspect-[208/96] inset-x-0 bottom-0 bg-brand rounded-xl lg:rounded-3xl" />
            <div class="pb-0 p-4">
              <div class="relative aspect-square w-16 md:w-24 lg:w-32 xl:w-44">
                <Transition enter-from-class="translate-y-[150%]" enter-active-class="transition duration-500">
                  <NuxtImg size="176"
                    class="relative w-16 md:w-24 lg:w-32 xl:w-44 drop-shadow-[20px_5px_10px_var(--fallback-b1,oklch(var(--b1)/.3))]"
                    src="/brand/me.png" />
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