<script setup lang="ts">
defineProps < {
  title: string
  description: string
  readingTime: string
} > ()

function removeInvalidChars(text: string) {
  return text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
}
</script>

<template>
  <div
    class="relative h-full w-full justify-between bg-stone-950 p-24"
    data-theme="dark"
  >
    <div class="absolute inset-0 flex opacity-20">
      <div class="right-[-50%] top-[-50%] size-300 rounded-full bg-[radial-gradient(#9233ea,#0c0a09,#0c0a09)] shadow-xl" />
    </div>
    <div class="absolute inset-0 flex opacity-20">
      <div class="bottom-[-50%] left-[-50%] size-120 rounded-full bg-[radial-gradient(#B5179E,#0c0a09,#0c0a09)] shadow-xl" />
    </div>
    <div class="text-6xl text-white font-bold">
      {{ title }}
    </div>
    <div>
      <div class="flex flex-wrap text-3xl text-stone-500">
        {{ removeInvalidChars(description) }}
      </div>
    </div>
    <div v-if="readingTime" class="flex flex-wrap items-start justify-between gap-6 text-3xl text-stone-600">
      <div class="flex items-center gap-3">
        <Icon name="gg:alarm" /> {{ readingTime }}
      </div>
      <div class="text-4xl font-bold">
        SEREJO.DEV
      </div>
    </div>
  </div>
</template>
