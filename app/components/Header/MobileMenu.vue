<script lang="ts" setup>
import type MenuService from '~/utils/menu/MenuService';

defineProps<{ service: MenuService }>()
</script>

<template>
  <div class="grid gap-6">
    <NuxtLink
      v-for="(item, i) in service.get()" v-bind="item.getBinding()" :key="i"
      class="leading-none text-nowrap text-4xl"
    >
      {{ $t(item.content as string) }}
    </NuxtLink>
  </div>
</template>
