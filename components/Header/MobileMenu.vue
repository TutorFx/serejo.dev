<template>
    <div class="py-6 grid gap-6">
        <NuxtLink v-for="(item, i) in service.get()" v-bind="item.getBinding()" :key="i"
            class="text-nowrap leading-none text-4xl">
            {{ item.content }}
        </NuxtLink>
    </div>
</template>

<script lang="ts" setup>
import type MenuService from '~/utils/menu/MenuService';

defineProps<{ service: MenuService }>()
</script>