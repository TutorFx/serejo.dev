<script lang="ts" setup>
import type MenuService from '~/utils/menu/MenuService'

defineProps<{ service: MenuService }>()
const model = defineModel<boolean>()
</script>

<template>
  <div class="py-6 grid gap-6 grid-cols-[max-content_1fr]">
    <div>
      <h2 class="text-2xl font-logo">
        Gabriel S.
      </h2>
    </div>
    <div class="items-center sm:grid overflow-x-auto overflow-y-hidden hidden">
      <div class="flex justify-end items-center gap-6 flex-nowrap">
        <LanguagePopup size="28" v-hoverable:lang />
        <ClientOnly>
          <DarkToggle just-icon size="28" />
          <template #fallback>
            <div class="h-6 bg-base-300 rounded-full w-6" />
          </template>
        </ClientOnly>
        <NuxtLink
          v-for="(item, i) in service.get()" v-bind="item.getBinding()" v-hoverable:internal :key="i"
          class="leading-none text-nowrap navlink"
        >
          {{ $t(item.content as string) }}
        </NuxtLink>
      </div>
    </div>
    <div class="grid justify-end grid-flow-col gap-6 items-center sm:hidden">
      <ClientOnly>
        <DarkToggle just-icon size="28" />
        <template #fallback>
          <div class="w-6 h-6 bg-base-300 rounded-full" />
        </template>
      </ClientOnly>
      <HeaderToggleMenu v-model="model" />
    </div>
  </div>
</template>

<style scoped>
.router-link-exact-active.navlink {
  @apply underline decoration-wavy decoration-primary;
}
</style>
