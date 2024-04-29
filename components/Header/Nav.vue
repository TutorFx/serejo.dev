<script lang="ts" setup>
import type MenuService from '~/utils/menu/MenuService'

defineProps<{ service: MenuService }>()
const model = defineModel<boolean>()
</script>

<template>
  <div class="grid grid-cols-[max-content_1fr] gap-6 py-6">
    <div>
      <h2 class="font-logo text-2xl">
        Gabriel S.
      </h2>
    </div>
    <div class="hidden items-center overflow-x-auto overflow-y-hidden sm:grid">
      <div class="flex flex-nowrap items-center justify-end gap-6">
        <LanguagePopup v-hoverable:lang size="28" />
        <ClientOnly>
          <DarkToggle just-icon size="28" />
          <template #fallback>
            <div class="bg-base-300 h-6 w-6 rounded-full" />
          </template>
        </ClientOnly>
        <NuxtLink
          v-for="(item, i) in service.get()" v-bind="item.getBinding()" :key="i" v-hoverable:internal
          class="navlink text-nowrap leading-none"
        >
          {{ $t(item.content as string) }}
        </NuxtLink>
      </div>
    </div>
    <div class="grid grid-flow-col items-center justify-end gap-6 sm:hidden">
      <ClientOnly>
        <DarkToggle just-icon size="28" />
        <template #fallback>
          <div class="bg-base-300 h-6 w-6 rounded-full" />
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
