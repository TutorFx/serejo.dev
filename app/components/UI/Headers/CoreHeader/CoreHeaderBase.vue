<script lang="ts">
export interface CoreHeaderBaseProps {
  list: MenuList<FinalRoute>
}
</script>

<script setup lang="ts">
defineProps<CoreHeaderBaseProps>()
const model = defineModel<boolean>({ default: false })

const { locale } = useI18n()

const LocalePathFunction = useLocalePath()
</script>

<template>
  <div class="grid min-h-24 grid-flow-col items-center justify-between">
    <NuxtLink :to="LocalePathFunction({ name: 'index' })" class="font-logo text-2xl">
      Gabriel S.
    </NuxtLink>
    <div class="grid grid-flow-col items-center justify-center gap-3">
      <div class="hover:bg-base-300 rounded-full p-0.5">
        <UIToggleDark />
      </div>
      <UIPopover class="max-md:hidden">
        <div class="hover:bg-base-300 grid items-center rounded-full p-1">
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
