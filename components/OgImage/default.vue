<script setup lang="ts">
defineProps < {
  title: string
  description: string
  readingTime: string
} > ()
</script>

<template>
  <div
    class="w-full h-full justify-center relative p-24 bg-stone-950"
    data-theme="dark"
  >
    <div class="absolute flex inset-0 opacity-20">
      <div class="rounded-full shadow-xl size-300 top-[-20%] right-[-30%] bg-[radial-gradient(#F22B29,#0c0a09,#0c0a09)]" />
    </div>
    <div class="absolute flex inset-0 opacity-20">
      <div class="rounded-full shadow-xl size-300 bottom-[-30%] left-[-20%] bg-[radial-gradient(#F49D37,#0c0a09,#0c0a09)]" />
    </div>
    <div class="text-white font-bold mx-auto text-center text-[140px]">
      {{ title }}
    </div>

    <div class="justify-between items-center text-stone-600">
      <div class="font-bold text-6xl">
        SEREJO.DEV
      </div>
    </div>
  </div>
</template>
