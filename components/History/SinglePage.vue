<script setup lang="ts">
import HistoryController from '~/utils/cms/history/HistoryController'

const { value } = defineProps<{
  value: HistoryController
}>()

const localePath = useLocalePath()

const { t } = useI18n()

defineOgImage({
  component: 'CmsPage',
  props: {
    description: value.getTruncatedDescription(330),
    readingTime: t('time.reading_time', { time: value.getLocaleReadingTime() }),
  },
})
</script>

<template>
  <div v-if="(value instanceof HistoryController)">
    <DynamicHero class="[view-transition-name:hero]">
      <Container>
        <div class="grid justify-center items-center">
          <div
            class="relative grid gap-3 text-3xl md:text-6xl lg:text-7xl auto-rows-[1fr] md:gap-5 lg:gap-7 [text-shadow:_6px_1px_30px_var(--fallback-b1,oklch(var(--b1)/1))]"
          >
            {{ value.org }}
            <div class="bg-base-300 absolute rounded-full -inset-12 z-[-1] blur-xl opacity-50" />
          </div>
        </div>
      </Container>
      <div
        class="absolute inset-0 grid items-center justify-center max-w-screen -z-[2] pointer-events-none rotate-180"
      >
        <div class="relative max-h-0 max-w-0 -rotate-[12deg]">
          <Icon
            name="HeroLine"
            class="absolute -translate-y-[50%] -translate-x-[50%] rotate-5 w-[100dvw] h-[100dvh] scale-[99%] md:scale-[100%]"
            size="100%"
          />
        </div>
      </div>
    </DynamicHero>
    <div class="max-h-0">
      <div class="-translate-y-[50%]">
        <Container>
          <Btn :to="localePath({ name: `history` })">
            <Icon name="mdi:chevron-left" /> {{ $t('navigation.back') }}
          </Btn>
        </Container>
      </div>
    </div>
    <div class="bg-base-200 rounded-b-3xl py-24 pt-12">
      <Container class="grid gap-3 max-w-4xl">
        <div class="grid grid-cols-[1fr_max-content]">
          <div class="text-sm text-primary">
            {{ value.title }}
          </div>
          <div>
            <div class="grid grid-flow-col justify-start items-center gap-1">
              <Icon name="solar:calendar-bold-duotone" />
              <div class="text-neutral text-xs md:text-lg">
                {{ value.getDateToLocaleString(useLocale()).join(` ● `) }}
              </div>
            </div>
          </div>
        </div>
        <div class="text-4xl">
          {{ value.location }}
        </div>
        <ContentRenderer class="text-xl prose prose-md max-w-none" :value="value" />
      </Container>
    </div>
  </div>
</template>
