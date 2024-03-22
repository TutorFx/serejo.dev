<template>
    <div class="py-6 grid grid-cols-[max-content_1fr] gap-6">
        <div>
            <h2 class="font-logo text-2xl">
                Gabriel S.
            </h2>
        </div>
        <div class="sm:grid items-center overflow-x-auto overflow-y-hidden hidden">
            <div class="flex flex-nowrap justify-end items-center gap-6">
                <ClientOnly>
                    <DarkToggle justIcon size="28" />
                    <template #fallback>
                        <div class="w-6 h-6 bg-base-300 rounded-full" />
                    </template>
                </ClientOnly>
                <NuxtLink v-for="(item, i) in service.get()" v-bind="item.getBinding()" :key="i"
                    class="text-nowrap leading-none navlink">
                    {{ $t(item.content as string) }}
                </NuxtLink>
            </div>
        </div>
        <div class="grid justify-end sm:hidden grid-flow-col gap-6 items-center">
            <ClientOnly>
                <DarkToggle justIcon size="28" />
                <template #fallback>
                    <div class="w-6 h-6 bg-base-300 rounded-full" />
                </template>
            </ClientOnly>
            <HeaderToggleMenu v-model="model" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type MenuService from '~/utils/menu/MenuService';

defineProps<{ service: MenuService }>()
const model = defineModel<boolean>()
</script>

<style scoped>
.router-link-exact-active.navlink {
    @apply underline decoration-wavy decoration-primary
}
</style>