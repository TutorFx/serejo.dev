<script setup lang="ts">
defineProps < {
  title: string
  description: string
  readingTime: string
} > ()
</script>

<template>
  <div
    class="relative h-full w-full justify-center bg-stone-950 p-24"
    data-theme="dark"
  >
    <div class="absolute inset-0 flex opacity-20">
      <div class="right-[-30%] top-[-20%] size-300 rounded-full bg-[radial-gradient(#F22B29,#0c0a09,#0c0a09)] shadow-xl" />
    </div>
    <div class="absolute inset-0 flex opacity-20">
      <div class="bottom-[-30%] left-[-20%] size-300 rounded-full bg-[radial-gradient(#F49D37,#0c0a09,#0c0a09)] shadow-xl" />
    </div>
    <div class="mx-auto text-center text-[140px] text-white font-bold">
      {{ title }}
    </div>

    <div class="items-center justify-between text-stone-600">
      <div class="text-6xl font-bold">
        SEREJO.DEV
      </div>
    </div>
  </div>
</template>
