<script setup lang="ts">
defineProps < {
  title: string
  description: string
  readingTime: string
} > ()

function removeInvalidChars(text: string) {
  return text.replace(/([\u2700-\u27BF\uE000-\uF8FF\u2011-\u26FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD10-\uDDFF])/g, '')
}
</script>

<template>
  <div
    class="w-full justify-between relative h-full p-24 bg-stone-950"
    data-theme="dark"
  >
    <div class="absolute flex inset-0 opacity-20">
      <div class="rounded-full shadow-xl size-300 top-[-50%] right-[-50%] bg-[radial-gradient(#9233ea,#0c0a09,#0c0a09)]" />
    </div>
    <div class="absolute flex inset-0 opacity-20">
      <div class="rounded-full shadow-xl left-[-50%] bottom-[-50%] bg-[radial-gradient(#B5179E,#0c0a09,#0c0a09)] size-120" />
    </div>
    <div class="text-white font-bold text-6xl">
      {{ title }}
    </div>
    <div>
      <div class="flex text-3xl flex-wrap text-stone-500">
        {{ removeInvalidChars(description) }}
      </div>
    </div>
    <div v-if="readingTime" class="flex flex-wrap gap-6 text-3xl justify-between items-start text-stone-600">
      <div class="flex gap-3 items-center">
        <Icon name="gg:alarm" /> {{ readingTime }}
      </div>
      <div class="text-4xl font-bold">
        SEREJO.DEV
      </div>
    </div>
  </div>
</template>
