<script lang="ts">
export interface HeroCmsProps {
  title: string
  backTo: RouteLocationI18nGenericPath
}
</script>

<script setup lang="ts">
const props = defineProps<HeroCmsProps>()
const localePath = useLocalePath()
const { t } = useI18n()
</script>

<template>
  <div class="relative grid grid-rows-[max-content_1fr_max-content] min-h-42 bg-base-200 rounded-2xl overflow-hidden group">
    <div v-if="props.backTo" class="absolute top-0 left-0 p-4">
      <UIButton :to="localePath(props.backTo)" class="-translate-x-[calc(100%+theme(space.4))] group-hover:translate-x-0 duration-300">
        <template #leading>
          <Icon name="material-symbols:arrow-back" />
        </template>{{ $t('navigation.back') }}
      </UIButton>
    </div>
    <slot name="top"><div class="h-12" /></slot>
    <div class="text-5xl font-bold grid items-center justify-center text-center text-balance">
      {{ props.title }}
    </div>
    <slot class="info"><div class="h-12" /></slot>
  </div>
</template>