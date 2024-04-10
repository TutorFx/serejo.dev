<script setup lang="ts">
import type CmsController from '~/utils/cms/CmsController';

defineProps < {
    title: string,
    description: string,
    readingTime: string
} > ();
</script>

<template>
  <div
    class="w-full h-full justify-center relative p-24 bg-stone-950"
    data-theme="dark"
  >
    <div class="absolute flex inset-0 opacity-20">
      <div class="rounded-full top-[-20%] right-[-30%] bg-[radial-gradient(#F22B29,#0c0a09,#0c0a09)] shadow-xl size-300" />
    </div>
    <div class="absolute flex inset-0 opacity-20">
      <div class="rounded-full left-[-20%] bottom-[-30%] bg-[radial-gradient(#F49D37,#0c0a09,#0c0a09)] shadow-xl size-300" />
    </div>
    <div class="text-[140px] text-white font-bold mx-auto text-center">
      {{ title }}
    </div>

    <div class="text-stone-600 justify-between items-center">
      <div class="text-6xl font-bold">
        SEREJO.DEV
      </div>
    </div>
  </div>
</template>
