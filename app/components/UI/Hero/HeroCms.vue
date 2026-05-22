<script lang="ts">
export interface HeroCmsProps {
  title: string
  backTo: RouteLocationI18nGenericPath
}
</script>

<script setup lang="ts">
const props = defineProps<HeroCmsProps>()
const localePath = useLocalePath()
</script>

<template>
  <div class="bg-base-200 group relative grid min-h-42 grid-rows-[max-content_1fr_max-content] overflow-hidden rounded-2xl">
    <div v-if="props.backTo" class="absolute top-0 left-0 p-4">
      <UIButton :to="localePath(props.backTo)" class="-translate-x-[calc(100%+theme(space.4))] duration-300 group-hover:translate-x-0">
        <template #leading>
          <Icon name="material-symbols:arrow-back" />
        </template>{{ $t('navigation.back') }}
      </UIButton>
    </div>
    <slot name="top">
      <div class="h-12" />
    </slot>
    <div class="grid items-center justify-center text-center text-5xl font-bold text-balance">
      {{ props.title }}
    </div>
    <slot class="info">
      <div class="h-12" />
    </slot>
  </div>
</template>
