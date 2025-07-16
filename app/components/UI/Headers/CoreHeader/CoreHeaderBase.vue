<script lang="ts">
export interface CoreHeaderBaseProps {
  list: MenuList<FinalRoute>
}
</script>

<script setup lang="ts">

const props = defineProps<CoreHeaderBaseProps>()
const model = defineModel<boolean>({ default: false })

const { locale } = useI18n()

const LocalePathFunction = useLocalePath()
</script>

<template>
  <div class="grid grid-flow-col justify-between items-center min-h-24">
    <NuxtLink :to="LocalePathFunction({ name: 'index' })" class="text-2xl font-logo">
      Gabriel S.
    </NuxtLink>
    <div class="grid grid-flow-col gap-3 justify-center items-center">
      <div class="hover:bg-base-300 p-0.5 rounded-full">
        <UIToggleDark />
      </div>
      <UIPopover class="max-md:hidden">
        <div class="grid items-center hover:bg-base-300 p-1 rounded-full">
          <UILocaleIcon size="28" :country-code="locale" />
        </div>
        <template #content>
          <UILocaleButton />
        </template>
      </UIPopover>
      <UINavigationMenu class="gap-3 px-0 max-md:hidden" direction="vertical" :list />
      <UIToggleMenu v-model="model" />
    </div>
  </div>
</template>