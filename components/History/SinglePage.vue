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
    description: value.getSafeTruncatedDescription(330),
    readingTime: t('time.reading_time', { time: value.getLocaleReadingTime() }),
  },
})
</script>

<template>
  <div v-if="(value instanceof HistoryController)">
    <DynamicHero>
      <Container>
        <div class="grid items-center justify-center">
          <div
            class="[text-shadow:_6px_1px_30px_var(--fallback-b1,oklch(var(--b1)/1))] relative grid auto-rows-[1fr] gap-3 text-3xl lg:gap-7 md:gap-5 lg:text-7xl md:text-6xl"
          >
            {{ value.org }}
            <div class="bg-base-300 absolute z-[-1] rounded-full opacity-50 blur-xl -inset-12" />
          </div>
        </div>
      </Container>
    </DynamicHero>
    <div class="max-h-0">
      <div class="-translate-y-[50%]">
        <Container>
          <Btn v-hoverable:internal :to="localePath({ name: `history` })">
            <Icon name="mdi:chevron-left" /> {{ $t('navigation.back') }}
          </Btn>
        </Container>
      </div>
    </div>
    <div class="bg-base-200 rounded-b-3xl py-24 pt-12">
      <Container class="grid max-w-4xl gap-3">
        <div class="grid grid-cols-[1fr_max-content]">
          <div class="text-primary text-sm">
            {{ value.title }}
          </div>
          <div>
            <div class="grid grid-flow-col items-center justify-start gap-1">
              <Icon name="solar:calendar-bold-duotone" />
              <div class="text-xs text-neutral md:text-lg">
                {{ value.getDateToLocaleString(useLocale()).join(` ● `) }}
              </div>
            </div>
          </div>
        </div>
        <div class="text-4xl">
          {{ value.location }}
        </div>
        <ContentRenderer class="prose-md max-w-none text-xl prose" :value="value" />
      </Container>
    </div>
  </div>
</template>
